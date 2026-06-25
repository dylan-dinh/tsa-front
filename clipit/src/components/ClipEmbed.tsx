import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';
import { getTwitchEmbedUrl } from '../services/api';
import { colors } from '../styles/theme';
import { getCategoryHue, gradientFor } from '../data/categories';

interface ClipEmbedProps {
  clip: Clip;
  width: number;
  height: number;
  isActive?: boolean;
  /** Pre-warm the WebView silently before the clip becomes active */
  preload?: boolean;
}

// ─── Scripts injected into the native WebView ─────────────────────────────────

/**
 * Runs once after page load (injectedJavaScript prop).
 * - Hides Twitch player chrome (info bar, controls)
 * - Polls to auto-accept the "mature audiences" gate
 * - Attaches 'playing' event listener → notifies React Native
 *
 * NOTE: object-fit is intentionally NOT set to cover here so the 16:9 video
 * is not cropped. The container/page dimensions control visible size.
 */
const INIT_SCRIPT = `
(function() {
  /* ── 1. Hide player chrome ── */
  var s = document.createElement('style');
  s.textContent = [
    'html,body{margin:0;padding:0;background:#000;overflow:hidden;}',
    /* Top info bar (channel name, game, views) */
    '.player-streaminfo,[class*="StreamInfo"],[class*="channel-info"],',
    '[class*="ChannelInfo"],[data-a-target="player-overlay-inactive-top"],',
    '.top-bar,[class*="TopNav"]{display:none!important;}',
    /* Bottom controls bar */
    '.player-controls,[data-a-target="player-controls"],',
    '[class*="PlayerControls"]{display:none!important;}',
    /* Big centered play/pause button overlay */
    '.click-handler,[class*="ClickHandler"],',
    '[data-a-target="player-overlay-click-handler"]',
    '{pointer-events:none!important;opacity:0!important;}',
    'a[href*="twitch.tv"]{display:none!important;}',
  ].join('');
  (document.head || document.documentElement).appendChild(s);

  /* ── 2. Poll: auto-accept "mature audiences" gate ── */
  var gTicks = 0;
  var gIv = setInterval(function() {
    var btn = document.querySelector('[data-a-target="player-overlay-mature-accept"]');
    if (!btn) {
      var all = document.querySelectorAll('button,[role="button"]');
      for (var i = 0; i < all.length; i++) {
        var lbl = (all[i].innerText || all[i].textContent || '').trim().toLowerCase();
        if (lbl === 'start watching' || lbl === 'continue' ||
            lbl === 'accept'        || lbl === 'i agree') {
          btn = all[i]; break;
        }
      }
    }
    if (btn) { btn.click(); clearInterval(gIv); }
    if (++gTicks > 40) clearInterval(gIv);
  }, 400);

  /* ── 3. Attach 'playing' listener to notify React Native ── */
  function attachListener() {
    var vs = document.querySelectorAll('video');
    if (!vs.length) return false;
    vs.forEach(function(v) {
      v.addEventListener('playing', function() {
        try { window.ReactNativeWebView.postMessage(JSON.stringify({type:'playing'})); } catch(e) {}
      });
    });
    return true;
  }
  var pTicks = 0;
  var pIv = setInterval(function() {
    if (attachListener() || ++pTicks > 30) clearInterval(pIv);
  }, 300);
})();
true;
`;

/**
 * Unmute + play the video.
 * IMPORTANT: if the video is already playing (pre-buffered while preloading),
 * v.paused is false so we skip play() — but we MUST still post 'playing' so
 * React Native knows to drop the thumbnail overlay. Without this the user
 * hears sound but sees the purple/gradient thumbnail (the bug).
 */
const PLAY_SCRIPT = `
(function tryPlay(n) {
  var vs = document.querySelectorAll('video');
  if (vs.length) {
    vs.forEach(function(v) {
      v.muted  = false;
      v.volume = 1;
      if (v.paused) {
        v.play().catch(function(){});
      } else {
        /* Already buffering/playing from preload — tell React Native NOW */
        try { window.ReactNativeWebView.postMessage(JSON.stringify({type:'playing'})); } catch(e) {}
      }
    });
  } else if (n > 0) {
    setTimeout(function() { tryPlay(n - 1); }, 200);
  }
})(20);
true;
`;

/** Mute + pause so background clips are truly silent and don't waste CPU */
const PAUSE_SCRIPT = `
document.querySelectorAll('video').forEach(function(v) {
  v.muted = true;
  v.pause();
});
true;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeThumb = (url?: string) =>
  url?.replace(/%?\{width\}/g, '480').replace(/%?\{height\}/g, '272');

function Fallback({ width, height }: { width: number; height: number }) {
  return (
    <View style={[styles.fallback, { width, height }]}>
      <MaterialCommunityIcons name="video-off-outline" size={40} color={colors.faint} />
      <Text style={styles.fallbackText}>Clip unavailable</Text>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClipEmbed({
  clip,
  width,
  height,
  isActive = false,
  preload  = false,
}: ClipEmbedProps) {
  const [loaded,  setLoaded]  = useState(false);
  /**
   * `playing` becomes true once the WebView posts a 'playing' message.
   * We do NOT gate this on isActive: a preloaded clip fires 'playing' while
   * inactive, and we store it so the thumbnail drops instantly when it later
   * becomes active (no second event fires because the video never stopped).
   */
  const [playing, setPlaying] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const hue = getCategoryHue(clip.GameID);

  const parent =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? window.location.hostname
      : 'localhost';

  const thumb = normalizeThumb(clip.ThumbnailURL);

  // ── Native: play/pause via JS when isActive changes ───────────────────────
  useEffect(() => {
    if (Platform.OS === 'web' || !webviewRef.current) return;
    webviewRef.current.injectJavaScript(isActive ? PLAY_SCRIPT : PAUSE_SCRIPT);
  }, [isActive]);

  // Thumbnail is shown while:
  //   • not active (hides the preloaded WebView from the user)
  //   • active but video not yet playing
  const showThumb = !isActive || !playing;

  // ── Thumbnail ──────────────────────────────────────────────────────────────
  const Thumbnail = (
    <View
      style={[
        styles.thumb,
        Platform.OS === 'web'
          ? ({ backgroundImage: gradientFor(hue) } as any)
          : { backgroundColor: `hsl(${hue} 50% 18%)` },
        { width, height },
      ]}
    >
      {thumb ? (
        <Image
          source={{ uri: thumb }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : null}
      {(isActive || preload) && !loaded && (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }}
        />
      )}
    </View>
  );

  if (!isActive && !preload) return Thumbnail;

  // ── WEB ─────────────────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    if (!isActive) {
      const preUrl = getTwitchEmbedUrl(clip, parent, { autoplay: false, muted: true });
      return (
        <View style={{ width, height }}>
          {Thumbnail}
          {/* @ts-ignore */}
          {preUrl && <iframe src={preUrl} width={1} height={1}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />}
        </View>
      );
    }
    const activeUrl = getTwitchEmbedUrl(clip, parent, { autoplay: true, muted: false });
    if (!activeUrl) return <Fallback width={width} height={height} />;
    return (
      <View style={{ width, height }}>
        {!loaded && Thumbnail}
        {/* @ts-ignore */}
        <iframe
          key={`active-${clip.ID}`}
          src={activeUrl}
          width={width}
          height={height}
          allowFullScreen
          frameBorder={0}
          allow="autoplay; fullscreen"
          style={{
            border: 0, borderRadius: 12, backgroundColor: '#000',
            position: loaded ? 'relative' : 'absolute', top: 0, left: 0,
          }}
          onLoad={() => setLoaded(true)}
        />
      </View>
    );
  }

  // ── NATIVE ──────────────────────────────────────────────────────────────────
  // Always load with muted=true in URL — browsers require this for autoplay.
  // PLAY_SCRIPT unmutes (and reports playing) when isActive becomes true.
  // Stable key prevents remount across preload ↔ active transitions so the
  // video keeps buffering in the background.
  const url = getTwitchEmbedUrl(clip, parent, { autoplay: true, muted: true });
  if (!url) return <Fallback width={width} height={height} />;

  return (
    <View style={{ width, height, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Thumbnail overlaid until the video fires its first 'playing' event */}
      {showThumb && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}>
          {Thumbnail}
        </View>
      )}
      <WebView
        key={`clip-${clip.ID}`}
        ref={webviewRef}
        source={{ uri: url }}
        style={{ flex: 1, backgroundColor: '#000' }}
        scrollEnabled={false}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        originWhitelist={['*']}
        injectedJavaScript={INIT_SCRIPT}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            // No isActive gate: a preloaded clip fires 'playing' while inactive.
            // showThumb already handles visibility via the !isActive check.
            if (msg.type === 'playing') setPlaying(true);
          } catch (_) {}
        }}
        onLoadEnd={() => {
          setLoaded(true);
          if (isActive) webviewRef.current?.injectJavaScript(PLAY_SCRIPT);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  fallbackText: { color: colors.gray, fontSize: 13 },
});
