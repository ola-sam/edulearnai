import pg from 'pg';
const { Client } = pg;

// Function to update sprite images
async function updateSpriteImages() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    console.log('Connected to the database');
    
    // Define the new sprites with SVG relative paths
    const spritesToUpdate = [
      {
        id: 1,
        name: 'Cat',
        imageUrl: '/assets/cat.svg'
      },
      {
        id: 2,
        name: 'Dog',
        imageUrl: '/assets/dog.svg'
      },
      {
        id: 3,
        name: 'Dinosaur',
        imageUrl: '/assets/dinosaur.svg'
      },
      {
        id: 4,
        name: 'Robot',
        imageUrl: '/assets/robot.svg'
      },
      {
        id: 5,
        name: 'Astronaut',
        imageUrl: '/assets/astronaut.svg'
      }
    ];
    
    // Update each sprite in the database
    for (const sprite of spritesToUpdate) {
      const query = {
        text: 'UPDATE visual_sprites SET image_url = $1 WHERE id = $2',
        values: [sprite.imageUrl, sprite.id]
      };
      
      const result = await client.query(query);
      console.log(`Updated sprite ${sprite.name}, rows affected: ${result.rowCount}`);
    }
    
    console.log('All sprites updated successfully');
    await client.end();
    
  } catch (error) {
    console.error('Error updating sprite images:', error);
  }
}

// Run the function
updateSpriteImages();