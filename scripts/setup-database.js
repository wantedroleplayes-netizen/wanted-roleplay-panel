const db = require('../config/database');

async function setupDatabase() {
    console.log('🔧 Configurando base de datos...');
    
    try {
        // Verificar conexión
        await db.query('SELECT 1');
        console.log('✅ Conexión a MySQL exitosa');
        
        // Verificar si las tablas existen
        const [tables] = await db.query('SHOW TABLES');
        console.log(`📊 Se encontraron ${tables.length} tablas`);
        
        if (tables.length === 0) {
            console.log('⚠️ No se encontraron tablas. Por favor ejecuta database.sql manualmente.');
            console.log('   mysql -u root -p wanted_roleplay < database.sql');
        } else {
            console.log('✅ Base de datos configurada correctamente');
            console.log('📋 Tablas:', tables.map(t => Object.values(t)[0]).join(', '));
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupDatabase();
