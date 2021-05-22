const {openDb} = require("./db")

const tablesNames = ["categories","posts","userdata", "commentaires", "avis", "visite", "liketab"]



async function createCategories(db){
  const insertRequest = await db.prepare("INSERT INTO categories(cat_name) VALUES(?)")
  const names = ["Signaux", "Informatique et Réseaux"]
  return await Promise.all(names.map(cat => {
    return insertRequest.run(cat)
  }))
}

async function createUserdata(db){
  const insertRequest = await db.prepare("INSERT INTO userdata(username, password, mail) VALUES(?, ?, ?)")
  const data = [{
    username:"username",
    password: "password",
    mail: "username@adressemail.pif"
   },
    {
     username:"admin",
     password: "admin",
     mail: "admin@adressemail.pif"
    }
  ]
  return await Promise.all(data.map(users => {
    return insertRequest.run([users.username, users.password, users.mail])
  }))
}

async function createPosts(db){
  const insertRequest = await db.prepare("INSERT INTO posts(name, content, category, lien, auteur) VALUES(?, ?, ?, ?, ?)")
  const contents = [{
    name: "Telecommunication",
    content: "Lien :  Les télécommunications sont définies comme la transmission d’informations à distance en utilisant des technologies électronique, informatique, de transmission filaire, optique ou électromagnétique. Ce terme a un sens plus large que son acception équivalente officielle « communication électronique ». Elles se distinguent ainsi de la poste qui transmet des informations ou des objets sous forme physique. ",
    category: 1,
    lien: "https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9communications",
    auteur: 2
  },
  {
    name: "Communication numérique",
    content: " La communication numérique, parfois appelée « communication digitale » (anglicisme), est un champ des sciences de l’information relatif à l'utilisation de l’ensemble des médias numériques : le web, les médias sociaux ou les terminaux mobiles par exemple. Ces médias sont utilisés comme des canaux de diffusion, de partage et de création d'informations1. ",
    category: 1,
    lien: "https://fr.wikipedia.org/wiki/Communication_num%C3%A9rique",
    auteur: 2
  },
  {
    name: "Programmation Web",
    content: "La programmation web est la programmation informatique qui permet d'éditer des sites web. Elle permet la création d'applications, destinées à être déployées sur Internet ou en Intranet. Ces applications web sont constituées de pages web pouvant prendre différentes formes, telles que  :  ",
    category: 2,
    lien: "https://fr.wikipedia.org/wiki/Programmation_web",
    auteur: 2,
  },
    {
      name: "TCP/IP ",
      content: "TCP/IP fut créé lorsque Bob Kahn, travaillant alors pour la DARPA, dut créer un protocole pour un réseau de commutation de paquets par radio. Bien qu'ayant été un ingénieur majeur de l'ARPANET, qui utilisait alors le protocole NCP, il ne put se résoudre à l'utiliser car celui-ci devait fonctionner avec l'équipement réseau IMP et en plus n'effectuait pas de contrôle des erreurs. Il créa donc avec Vinton Cerf un protocole permettant de relier les réseaux entre eux3. ",
      category: 2,
      lien: "https://fr.wikipedia.org/wiki/Suite_des_protocoles_Internet",
      auteur: 2,
    }
  ]
  return await Promise.all(contents.map(post => {
    return insertRequest.run([post.name, post.content, post.category, post.lien, post.auteur])
  }))
}

async function createCommentaire(db){
  const insertRequest = await db.prepare("INSERT INTO commentaires(name, content, article, iduser, numcom) VALUES(?, ?, ?, ?, ?)")
  const commentaire = [{
    name: "Les télécommunications",
    content: "C'est trop génial",
    article: 1,
    iduser: 2,
    numcom: 1,
  },
    {
      name: "réponse",
      content: "t'as raison",
      article: 1,
      iduser: 2,
      numcom: 2,
    }, 
    {
      name: "Les communications numérique",
      content: "Le partiel était un peu dur",
      article: 2,
      iduser: 1,
      numcom: 1,
    },
    {
      name: "La prog web c'est trop bien",
      content: "Youpi",
      article: 3,
      iduser: 2,
      numcom: 1,
    }, 
    {
      name: "réponse",
      content: "Fayot",
      article: 3,
      iduser: 1,
      numcom: 2,
    }
  ]
  return await Promise.all( commentaire.map(comm => {
    return insertRequest.run([comm.name, comm.content, comm.article, comm.iduser, comm.numcom])
  }))
}

async function createAvis(db){
  const insertRequest = await db.prepare("INSERT INTO avis(dislike, like, article) VALUES(?, ?, ?)")
  const avis = [{
    dislike: 3,
    like: 88,
    article: 1
  }, 
  {
    dislike: 7,
    like: 22,
    article: 2
  }, 
  {
    dislike: 0,
    like: 261,
    article: 3
  }, 
  {
    dislike: 2,
    like: 23,
    article: 4
    
  }
  ]
  return await Promise.all( avis.map(av => {
    return insertRequest.run([av.dislike, av.like, av.article])
  }))
}

async function createVisite(db){
  const insertRequest = await db.prepare("INSERT INTO visite(user, article) VALUES(?, ?)")
  const visite = [{
    user: 2,
    article: 1
  }
  ]
  return await Promise.all( visite.map(vis => {
    return insertRequest.run([vis.user, vis.article])
  }))
}

async function createLiketab(db){
  const insertRequest = await db.prepare("INSERT INTO liketab(user, article, etat) VALUES(?, ?, ?)")
  const like = [{
    user: 3,
    article: 1,
    etat: 0 //0 neutre, 1 like, 2 dislike
  }
  ]
  return await Promise.all( like.map(like => {
    return insertRequest.run([like.user, like.article, like.etat])
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
          lien text,
          article int,
          auteur int,
          FOREIGN KEY(category) REFERENCES categories(cat_id),
          FOREIGN KEY(auteur) REFERENCES users(id)
        )
  `)
  const users = db.run(`
        CREATE TABLE IF NOT EXISTS userdata(
          id INTEGER PRIMARY KEY,
          username varchar(255),
          password varchar(255),
          mail varchar(255)
        )
  `)

  const commentaire = db.run(`
        CREATE TABLE IF NOT EXISTS commentaires(
          id INTEGER PRIMARY KEY,
          name varchar(255),
          content text,
          article int,
          iduser int,
          numcom int,
          FOREIGN KEY(article) REFERENCES post(id),
          FOREIGN KEY(iduser) REFERENCES user(id)
        )
  `)
  const avis= db.run(`
       CREATE TABLE IF NOT EXISTS avis(
          id INTEGER PRIMARY KEY,
          dislike int,
          like int,
          article int,
          FOREIGN KEY(article) REFERENCES post(id)
        )
`)
const visite = db.run(`
        CREATE TABLE IF NOT EXISTS visite(
          id INTEGER PRIMARY KEY,
          user int,
          article int,
          FOREIGN KEY(article) REFERENCES post(id)
        )
  `)
  const liketab = db.run(`
        CREATE TABLE IF NOT EXISTS liketab(
          id INTEGER PRIMARY KEY,
          user int,
          article int,
          etat int,
          FOREIGN KEY(article) REFERENCES post(id)
        )
  `)
  return await Promise.all([cat, post, users, commentaire, avis, visite, liketab])
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
  await createVisite(db)
  await createLiketab(db)
})()
