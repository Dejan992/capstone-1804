let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "1234"))
let session = driver.session();
const shortid = require('shortid');


const makeSlug = (string) => {
  return string.replace(/[^a-z0-9]/gi,'');
}

const addSlugPaths = async () => {
  const data = await session.run(`MATCH (n:Path) RETURN n`)
  const nodes = data.records
  data.records.forEach(async (node) => {
    const searchName = node._fields[0].properties.name
    const slug = makeSlug(searchName)
    const query = `MATCH (n)
      WHERE n.name = {searchName}
      SET n.slug = {slug}`
    const response = await session.run(query, {searchName, slug})
   })
}

const addSlugResource = async () => {
  const data = await session.run(`MATCH (n:Resource) RETURN n`)
  const nodes = data.records
  data.records.forEach(async (node) => {
    const searchName = node._fields[0].properties.name
    const slug = makeSlug(searchName)
    const query = `MATCH (n)
      WHERE n.name = {searchName}
      SET n.slug = {slug}`
    const response = await session.run(query, {searchName, slug})
   })
}



const addIdPaths = async () => {
  const data = await session.run(`MATCH (n:Path) RETURN n`)
  const nodes = data.records
  data.records.forEach(async (node) => {
    const searchName = node._fields[0].properties.name
    const newId = shortid.generate()
    const query = `MATCH (n)
      WHERE n.name = {searchName}
      SET n.uid = {newId}`
    const response = await session.run(query, {searchName, newId})
   })
}

const addIdResource = async () => {
  const data = await session.run(`MATCH (n:Resource) RETURN n`)
  const nodes = data.records
  data.records.forEach(async (node) => {
    const searchName = node._fields[0].properties.name
    const newId = shortid.generate()
    const query = `MATCH (n)
      WHERE n.name = {searchName}
      SET n.uid = {newId}`
    const response = await session.run(query, {searchName, newId})
   })
}

addIdPaths()
addIdResource()
addSlugPaths()
addSlugResource()
console.log('id/slug ran')
