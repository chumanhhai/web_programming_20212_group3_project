const connection = require("./startDb")

const imageTable = {
    upload: async function(image) {
        const { cps_id, data } = image
        const deleteQuery = "DELETE FROM image WHERE cps_id=?"
        const insertQuery = "INSERT INTO image values (?, ?)"

        await connection.query(deleteQuery, cps_id) // delete first
        await connection.query(insertQuery, [cps_id, data]) // then insert

    },
    
    remove: async function(cps_id) {
        const query = "DELETE FROM image WHERE cps_id=?"

        await connection.query(query, cps_id)
    },

    getImage: async function(cps_id) {
        const query = "SELECT data FROM image WHERE cps_id=?"
        
        const [result] = await connection.query(query, cps_id)
        return result
    },
}

module.exports = imageTable