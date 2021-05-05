const {openDb} = require("./db")

const tablesNames = ["categories","posts","userdata", "commentaires","avis"]



async function createCategories(db){
  const insertRequest = await db.prepare("INSERT INTO categories(cat_name) VALUES(?)")
  const names = ["Categorie 1", "Categorie 2"]
  return await Promise.all(names.map(cat => {
    return insertRequest.run(cat)
  }))
}

async function createUserdata(db){
  const insertRequest = await db.prepare("INSERT INTO userdata(username,password) VALUES(?, ?)")
  const data = [{
    username:"username",
    password: "password",
   },
    {
     username:"admin",
     password: "admin",
    }
  ]
  return await Promise.all(data.map(users => {
    return insertRequest.run([users.username, users.password])
  }))
}

async function createPosts(db){
  const insertRequest = await db.prepare("INSERT INTO posts(name, content, category) VALUES(?, ?, ?)")
  const contents = [{
    name: "Article 1",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    category: 1,
    article: 1
  },
    {
      name: "Article 2",
      content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
      category: 2,
      article: 1
    }
  ]
  return await Promise.all(contents.map(post => {
    return insertRequest.run([post.name, post.content, post.category])
  }))
}

async function createCommentaire(db){
  const insertRequest = await db.prepare("INSERT INTO commentaires(name, content, article) VALUES(?, ?, ?)")
  const commentaire = [{
    name: "Commentaire 1",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    article: 1
  }, 
  {
    name: "Commentaire 2",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    article: 2
  }
  ]
  return await Promise.all( commentaire.map(comm => {
    return insertRequest.run([comm.name, comm.content, comm.article])
  }))
}

async function createAvis(db){
  const insertRequest = await db.prepare("INSERT INTO avis(dislike, like) VALUES(?, ?)")
  const avis = [{
    dislike: 1,
    like: 3,
    dislikemis: 0,
    likemis: 0,
    article: 1
  }, 
  {
    dislike: 4,
    like: 0,
    dislikemis: 0,
    likemis: 0,
    article: 2
    
  }
  ]
  return await Promise.all( avis.map(av => {
    return insertRequest.run([av.dislike, av.like])
  }))
}

async function createTables(db){
  const cat = db.run(`
    CREATE TABLE IF NOT EXISTS categories(
      cat_id INTEGER PRIMARY KEY,
      cat_name varchar(255)
    )
  `)
  const post = db.run(`
        CREATE TABLE IF NOT EXISTS posts(
          id INTEGER PRIMARY KEY,
          name varchar(255),
          category int,
          content text,
          article int,
          FOREIGN KEY(category) REFERENCES categories(cat_id)
        )
  `)
  const users = db.run(`
        CREATE TABLE IF NOT EXISTS userdata(
          id INTEGER PRIMARY KEY,
          username varchar(255),
          password varchar(255)
        )
  `)

  const commentaire = db.run(`
        CREATE TABLE IF NOT EXISTS commentaires(
          id INTEGER PRIMARY KEY,
          name varchar(255),
          content text,
          article int,
          FOREIGN KEY(article) REFERENCES post(id)
        )
  `)
  const avis= db.run(`
       CREATE TABLE IF NOT EXISTS avis(
          id INTEGER PRIMARY KEY,
          dislike int,
          like int,
          dislikemis int,
          likemis int,
          article int
        )
`)
  return await Promise.all([cat, post, users, commentaire, avis])
}


async function dropTables(db){
  return await Promise.all(tablesNames.map( tableName => {
      return db.run(`DROP TABLE IF EXISTS ${tableName}`)
    }
  ))
}



(async () => {
  // open the database
  let db = await openDb()
  await dropTables(db)
  await createTables(db)
  await createCategories(db)
  await createPosts(db)
  await createUserdata(db)
  await createCommentaire(db)
  await createAvis(db)
})()
