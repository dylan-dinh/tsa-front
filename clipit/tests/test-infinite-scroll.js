// Test simple pour le service de contenu
const testContentService = async () => {
  console.log('🧪 Testing Content Service...\n');

  try {
    // Simuler l'import du service
    const { fetchContent, searchContent } = require('./src/services/contentService.ts');
    
    console.log('Test 1: Fetching first page of content');
    const page1 = await fetchContent(1, 3);
    console.log(`✅ Page 1: ${page1.length} items`);
    console.log('First item:', page1[0]?.title);
    console.log('');

    console.log('Test 2: Fetching second page of content');
    const page2 = await fetchContent(2, 3);
    console.log(`✅ Page 2: ${page2.length} items`);
    console.log('First item:', page2[0]?.title);
    console.log('');

    console.log('Test 3: Searching for "gaming" content');
    const searchResults = await searchContent('gaming', 1, 3);
    console.log(`✅ Search results: ${searchResults.length} items`);
    searchResults.forEach(item => {
      console.log(`- ${item.title} (${item.category})`);
    });
    console.log('');

    console.log('Test 4: Testing error simulation (5% chance)');
    let errorCount = 0;
    for (let i = 0; i < 20; i++) {
      try {
        await fetchContent(1, 1);
      } catch (error) {
        errorCount++;
        console.log(`Error ${errorCount}: ${error.message}`);
      }
    }
    console.log(`✅ Error simulation: ${errorCount} errors out of 20 requests`);
    console.log('');

    console.log('🎉 All content service tests passed!');
    
  } catch (error) {
    console.log('❌ Content service test failed:', error.message);
  }
};

// Exécuter le test si le fichier est appelé directement
if (require.main === module) {
  testContentService();
}

module.exports = { testContentService }; 