const db = require("../database/config")

async function add(user) {
    const [id] = await db("users").insert(user)
        return findById(id)
}

function find() {
    return db("users")
}

function findById(id) {
    return db("users")
        .where("id", id)
        .first()
}

module.exports = {
    add,
    find,
    findById
}