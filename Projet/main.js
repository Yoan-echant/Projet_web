
const express = require('express')
const {openDb} = require("./db")

const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
//const SQLiteStore = require('connect-sqlite3')(session);
const port = 3000
const sess = {
  //store: new SQLiteStore,
  secret: 'secret key',
  resave: true,
  rolling: true,
  numuser: -1,
  cookie: {
    maxAge: 1000 * 3600//ms
  },
  saveUninitialized: true
}

const authentification = {
  username: "username",
  password: "password"
}


if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');


const categories = [
  {id: 'home', name: 'Accueil', link:"/"},
  {id: 'cat1', name: 'Catégorie 1', link:"/cat1"},
  {id: 'cat2', name: 'Catégorie 2', link:"/cat2"}
]

app.post('/blog',(req, res) => {
  res.redirect(302,'/')
})

app.get('/login',(req, res) => {
  res.render('login', {logged: req.session.logged, numuser: req.session.numuser})
})

app.post('/login',async(req, res) => {
  const username = req.body.username
  const password = req.body.password
  const db = await openDb()
  const userdatas = await db.all(`
    SELECT * FROM userdata
  `)
  let test =0
  
  for (let step=1; step < userdatas.length+1; step++ ){
    if (
      test == 0
    ){
      const users = await db.all(`
        SELECT username FROM userdata
        WHERE id =?
      ` ,[step])
      const users_pass = await db.all(`
        SELECT password FROM userdata
        WHERE id =?
      ` ,[step])
      if(username == users[0].username
        ){
          test = 1
          if(
            password == users_pass[0].password
          ) {
            req.session.logged = true
            req.session.numuser= step
            data = {
              success: "Vous êtes log",
              logged: true,
              numuser: step
            }
          }else{
            data = {
            errors: "Le mot de passe n'est pas valide",
            logged: false
            }
          }
      }
    }
  }
  if(
    test == 0
  ) {
    data = {
      errors: "Le nom d'utilisateur est inconnu",
      logged: false
    }
  }
  res.render('login',data)
})

app.get('/signup',(req, res) => {
  res.render('signup')
})

app.post('/signup',async (req, res) => {
  const mail = req.body.mail
  const username = req.body.username
  const password = req.body.password
  const password_ver= req.body.password_ver
  const db = await openDb()
  const userdatas = await db.all(`
    SELECT * FROM userdata
  `)
  let test = 0
  let data = {
  }
  if (
    username.length < 4
  ){
    test = 1
    data = {
      errors: "Le nom d'utilisateur est trop court, il doit faire au moins 4 caractères",
      logged: false
    }
    res.render('signup',data)
  }else if (
    password.length < 6
  ){
    test = 1
    data = {
      errors: "Le mot de passe est trop court, il doit faire au moins 6 caractères",
      logged: false
    }
    res.render('signup',data)
  }else if (
    !mail.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)
  ){
    test = 1
    data = {
      errors: "Le format de l'adresse mail n'est pas valide",
      logged: false
    }
    res.render('signup',data)
  }else if (
    password != password_ver
  ){
    test = 1
    data = {
      errors: "Veuillez entrer deux fois le même mot de passe",
      logged: false
    }
  res.render('signup',data)
  }
  for (let step=1; step < userdatas.length+1; step++ ){
    const users = await db.all(`
      SELECT username,mail FROM userdata
      WHERE ID = ?
    `,[step])
    if(
      username == users[0].username
    ) {
      test = 1
      data = {
        errors: "Le nom d'utilisateur déja utilisé",
        logged: false
      }
      res.render('signup',data)
    }else if (
      mail == users[0].mail
    ){
      test = 1
      data = {
        errors: "Cette adresse mail est déja utilisé",
        logged: false
      }
      res.render('signup',data)
    }
  }if (
    test == 0
  ){
    console.log("username: "+ username +"   "+"mdp: "+ password + " mail " + mail)
    const add_users =await db.run(`
      INSERT INTO userdata(username, password, mail)
      VALUES(?, ?, ?)
    `,[username, password, mail])
    res.redirect(302,'/login')
  }
})


app.get('/tendance', async(req,res) =>{
  const db = await openDb()
  const categories = await db.all(`
    SELECT * FROM categories
  `)
  let posts = []
  posts = await db.all(`
    SELECT * FROM posts
    INNER JOIN avis on avis.id = posts.id
    ORDER BY like DESC
  `)
  
 
  //console.log(posts)
  res.render("tendance",{posts: posts,categories: categories, logged: req.session.logged, numuser: req.session.numuser})
})

app.post('/tendance', async(req,res) =>{
  res.redirect('/tendance')
})



app.get('/visite', async(req,res) =>{
  if (req.session.logged == false){
    res.redirect('/login')
  }
  numerouser = req.session.numuser
  //console.log(numerouser)
  const db = await openDb()
  const categories = await db.all(`
    SELECT * FROM categories
  `)
  let posts = []
  posts = await db.all(`
    SELECT * FROM posts
    INNER JOIN visite on visite.article = posts.id
    WHERE user= ?
  `,[numerouser])
  //console.log(posts)
  res.render("visite",{posts: posts,categories: categories, logged: req.session.logged, numuser: req.session.numuser})
})

app.post('/visite', async(req,res) =>{
  res.redirect('/tendance')
})



app.get('/logout',(req, res) => {
  //console.log(req.session.logged)
 if (req.session.logged = false){
    res.redirect(302,'/login')
 }else {
    req.session.logged = false
    res.redirect(302,'/')
 }
})
app.get('/lecture', async (req, res) => {
  const db = await openDb()

  const categories = await db.all(`
    SELECT * FROM categories
  `)
  console.log(categories)
  const post = await db.all(`
    SELECT * FROM posts
  `)
  console.log(post)
  const commentaires = await db.all(`
    SELECT * FROM commentaires
  `)
  console.log(commentaires)
  
})



app.get('/profile', async (req, res) => {
  if (!req.session.logged){
    res.redirect('/login')
  }
  else{
    const db = await openDb()
    iduser= req.session.numuser
    user = await db.get(`
        SELECT * FROM userdata
        WHERE id = ?
    `, [iduser])
    data={
      username: user.username,
      password: user.password,
      mail: user.mail,
      logged: req.session.logged
    }
    console.log(data)
    res.render('profile', data)
  }
})

app.post('/changemdp', async (req, res) => {
  const db = await openDb()
  iduser= req.session.numuser
  current_mdp=req.body.current_password
  mdp= req.body.password
  mdp_ver=req.body.password_ver
  password = await db.get(`
      SELECT password FROM userdata
      WHERE id = ?
  `, [iduser])
  let test = 0
  if (password.password != current_mdp){
    test =1
    data={
      errors: "Mauvais mot de passe"
    }
  }
  else if (mdp != mdp_ver){
    test =1
    data={
      errors: "Les nouveaux mdp ne sont pas identique"
    }
  }
  else if (mdp.length < 6){
    test =1
    data={
      errors: "Le mot de passe doit faire au moins 6 charactère"
    }
  }
  if (test == 0){
    changepassword = await db.run(`
    UPDATE userdata
    SET password = ?
    WHERE id = ?
  `, [mdp, iduser])
  res.redirect("/profile")
  }
  else{
    res.redirect("/profile",data)
  }
})


app.get('/commentaires2', async (req, res) => {
  res.render("commentaires")
})


/*app.get('/commentaire', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const db = await openDb()

  const com = await db.all(`
    SELECT * FROM commentaires 
  `)
  const data = {
      commentaire : com
  }
  console.log(com)
 
  
  res.render("commentaires", data)
})
*/

app.post('/commentaire/:id', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  //console.log("salut")
  const db = await openDb()
  const id = req.params.id
  const iduser = req.session.numuser
  const name = req.body.name
  const content = req.body.content

  const numcomliste = await db.all(`
    SELECT id FROM commentaires
    WHERE article = ?
  `,[id])
 
  const numcom = numcomliste.length + 1
  const article = id

  //console.log("article:"+ id +" utilisateur:"+ iduser + " commentaire:" + numcom)

  const commdate = await db.run(`
    INSERT INTO commentaires(name, content, article, iduser, numcom)
    VALUES(?, ?, ?, ?, ?)
  
  `,[name, content, article, iduser, numcom])
  
  res.redirect('/post/'+id)
})

app.get('/commentaire/:id/delete/:idcom', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  //console.log("salut")
  const db = await openDb()
  const id = req.params.id
  const iduser = req.session.numuser
  const numcom = req.params.idcom
 
  
  const article = id
  //console.log("article:"+ id +" utilisateur:"+ iduser + " commentaire:" + numcom)
  const commdate = await db.run(`
    DELETE FROM commentaires
    WHERE article = ? AND numcom = ? AND iduser = ?
  `,[article, numcom, iduser])
  //console.log("post commentaire : ")
  //console.log(commdate)
  
  res.redirect('/post/'+id)
})

app.get('/commentaire/:id/edit/:idcom', async (req, res) => {
  const id = req.params.id
  const iduser = req.session.numuser
  const idcom = req.params.idcom
  const db = await openDb()
  const commentaire= await db.get(`
    SELECT iduser, name, content FROM commentaires
    WHERE article = ? AND numcom = ?
  `,[id, idcom])
  console.log("utilisateur: "+ iduser +" auteur du commentaire:"+commentaire.iduser)
  if (
    iduser == commentaire.iduser
  ){
    data={
      name: commentaire.name,
      content: commentaire.content,
      id: id,
      idcom: idcom,
    }
    res.render('commentaire-edit',data)
  }
  else {
    console.log("Vous n'êtes pas la personne qui a créé ce commentaire")
    
    res.redirect('/post/'+id)
  }
})

app.post('/commentaire/:id/edit/:idcom', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const db = await openDb()
  const id = req.params.id
  const iduser = req.session.numuser
  const numcom = req.params.idcom
  const name= req.body.name
  const content= req.body.content
  console.log(req.params)
  //console.log("name: "+name + " content: "+ content)
  console.log("numcom: "+numcom + " iduser: "+ iduser+ " article: "+ id)
  const commdate = await db.run(`
    UPDATE commentaires
    SET content= ?, name = ?
    WHERE article = ? AND numcom = ? AND iduser = ?
  `,[content, name, id, numcom, iduser])

  res.redirect('/post/'+id)
})



app.post('/post/:id/delete', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const iduser = req.session.numuser
  const id = req.params.id
  await db.run(`
    DELETE FROM posts
    WHERE id = ? AND auteur = ?
  `,[id, iduser])
  res.redirect("/")
})

app.get('/post/create', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const db = await openDb()

  const categories = await db.all(`
    SELECT * FROM categories
  `)
  //console.log("get catégorie : ")
  //console.log(categories)
  
  res.render("post-create",{categories: categories})
})

app.post('/post/create', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const iduser = req.session.numuser
  const name = req.body.name
  const content = req.body.content
  const category = req.body.category
  const post = await db.run(`
    INSERT INTO posts(name, content, category, auteur)
    VALUES(?, ?, ?, ?)
  `,[name, content, category, iduser])
  console.log("post create post : ")
  console.log(post)
  res.redirect("/post/" + post.lastID)
})

app.get('/post/:id', async (req, res) => {
  const db = await openDb()
  const id = req.params.id
  const numuser = req.session.numuser
  const name=req.session.userdata
  const post = await db.get(`
    SELECT * FROM posts
    LEFT JOIN categories on categories.cat_id = posts.category
    WHERE id = ?
  `,[id])
  let aviss = await db.get(`
    SELECT like,dislike  FROM avis
    WHERE article = ?
  `,[id])

  if (
    typeof(aviss)==typeof(unevariablenondéfinie)
    ){
      const newavis= await db.run(`
        INSERT INTO avis(like, dislike, article)
        VALUES(?, ?, ?)
      `,[0, 0, id])
      aviss = await db.get(`
      SELECT like,dislike  FROM avis
      WHERE article = ?
    `,[id])
  }
  const aviuser = await db.get(`
    SELECT etat  FROM liketab
    WHERE user = ? AND article = ?
  `,[numuser, id])
  
  const commentaire = await db.all(`
    SELECT name,content FROM commentaires 
    WHERE article = ?
  `,[id]) 
  const commentaire2 = await db.all(`
    SELECT numcom FROM commentaires 
    WHERE article = ?
  `,[id])
  let currentavis = 0
  if (typeof(aviuser) == typeof(unevariablenondéfinie)){
    //console.log("On set a 0")
  }
  else {
    //console.log("On set depuis la bdd a:", aviuser.etat)
    currentavis = aviuser.etat
  }

  const commentaire_nb = commentaire.length
  let commentaire_content =Array.from({ length: commentaire_nb }, (_, i) => i)
  let commentaire_name =Array.from({ length: commentaire_nb }, (_, i) => i)
  
  //console.log(commentaire2)
  for (let k = 0; k < commentaire_nb; k++){
    //console.log(commentaire[k])
    console.log("numcom: "+ commentaire2[k].numcom)
    commentaire_content[k]= commentaire[k].content
    commentaire_name[k]= commentaire[k].name
  }

  //console.log(commentaire_content)
  //console.log(commentaire_name)


  const array_com = Array.from({ length: commentaire_nb }, (_, i) => i+1)
  //console.log(array_com)
  const data = {
    like:aviss.like,
    dislike:aviss.dislike,
    useropinion: currentavis,
    user: req.session.userdata
}

  res.render("post",{post: post, numuser: numuser, logged: req.session.logged, data, commentaire_name, commentaire_content, commentaire_nb, array_com})
})

app.post('/like/:id', async (req, res) => {
  const db = await openDb()
  const id = req.params.id
  const numuser = req.session.numuser
  const logged = req.session.logged
  
  if (logged){
    const aviss = await db.get(`
      SELECT like,dislike  FROM avis
      WHERE id = ?
    `,[id])
    let nblike = aviss.like +1

    const aviuserprecedent = await db.get(`
      SELECT etat FROM liketab
      WHERE article = ? AND user= ?
    `,[id, numuser])

    if (typeof(aviuserprecedent) == typeof(unevariablenondéfinie)){// Si on était jamais venue sur la page
      const création_avis = await db.get(`
        INSERT INTO liketab(user, article, etat)
        VALUES(?, ?, ?)
      `,[ numuser, id, 1])
    }
    else{
      if (aviuserprecedent.etat == 2){ // Si on like un poste qu'on avait disliké
        const avis2s = await db.get(`
          UPDATE avis
          SET dislike = ?
          WHERE id = ? 
        `,[ aviss.dislike-1 , id])
        const avisuser = await db.get(`
          UPDATE liketab
          SET etat = ?
          WHERE article = ? AND user = ?
        `,[ 1 , id, numuser])
      }
      else if(aviuserprecedent.etat== 1){
        const avisuser = await db.get(`
          UPDATE liketab
          SET etat = ?
          WHERE article = ? AND user = ?
        `,[ 0 , id, numuser])
        nblike = nblike-2
      }
      if (aviuserprecedent.etat==0){
        const avisuser = await db.get(`
          UPDATE liketab
          SET etat = ?
          WHERE article = ? AND user = ?
      `,[ 1 , id, numuser])
      }
    }
    const avis2s = await db.get(`
      UPDATE avis
      SET like = ?
      WHERE id = ? 
    `,[ nblike, id])

  } 
  //console.log(req.body.like);
  else{
    console.log("Erreur, vous n'êtes pas connecté")
  }
  res.redirect('/post/'+id /*,{avis : aviss} */)
})

app.get('/dislike/:id', async (req, res) => {
  const db = await openDb()
  const id = req.params.id
  const numuser = req.session.numuser
  const logged = req.session.logged

    if (logged) {
    const aviss = await db.get(`
      SELECT like,dislike  FROM avis
      WHERE id = ?
    `,[id])
    let nbdis= aviss.dislike+1
    const aviuserprecedent = await db.get(`
      SELECT *  FROM liketab
      WHERE article = ? AND user= ?
    `,[id, numuser])
    
    //console.log("état", typeof(aviuserprecedent))

    if (typeof(aviuserprecedent) == typeof(unevariablenondéfinie)){// Si on était jamais venue sur la page
      //console.log("On est entré")
      const création_avis = await db.get(`
        INSERT INTO liketab(user, article, etat)
        VALUES(?, ?, ?)
      `,[ numuser, id, 1])
    }
    else {
      //console.log(aviuserprecedent)
      if (aviuserprecedent.etat == 1){ // Si on like un poste qu'on avait disliké
        const avis2s = await db.get(`
          UPDATE avis
          SET like = ?
          WHERE id = ? 
        `,[ aviss.like-1 , id])
        const avisuser = await db.get(`
          UPDATE liketab
          SET etat = ?
          WHERE article = ? AND user = ?
        `,[ 2 ,id ,numuser])
      }
      if(aviuserprecedent.etat == 2){
        const avisuser = await db.get(`
        UPDATE liketab
        SET etat = ?
        WHERE article = ? AND user = ?
      `,[ 0 , id, numuser])
      nbdis =nbdis -2
      }
      if (aviuserprecedent.etat ==0){
        //console.log("on change la valeur")
        const avisuser = await db.get(`
          UPDATE liketab
          SET etat = ?
          WHERE article = ? AND user = ?
        `,[ 2 , id, numuser])
      }
    }
    const avis2s = await db.get(`
      UPDATE avis
      SET dislike = ?
      WHERE id = ? 
    `,[nbdis , id])
    //console.log(req.body.like);s
  }
  else {
    console.log("Erreur, vous n'êtes pas connecté")
  }
  res.redirect('/post/'+id)
})


app.get('/post/:id/edit', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const iduser = req.session.numuser
  const categories = await db.all(`
    SELECT * FROM categories
  `)
  const post = await db.get(`
    SELECT * FROM posts
    LEFT JOIN categories on categories.cat_id = posts.category
    WHERE id = ?
  `,[id])
  console.log("requete de : "+ iduser)
  console.log(post)
  if (post.auteur == iduser){
    res.render("post-edit",{post: post, categories: categories})
  }
  else {
    res.redirect("/post/"+id)
  }
})

app.post('/post/:id/edit', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const name = req.body.name
  const content = req.body.content
  const category = req.body.category

  await db.run(`
    UPDATE posts
    SET name = ?, content = ?, category = ?
    WHERE id = ?
  `,[name, content, category, id])
  res.redirect("/post/" + id)
})

app.get('/categories', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const categories = await db.all(`
    SELECT * FROM categories
  `)
  res.render("categories", {categories})
})

app.get('/category/:id', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const id = req.params.id
  const db = await openDb()
  const category = await db.get(`
    SELECT * FROM categories
    WHERE cat_id = ?
  `,[id])
  res.render("category-edit", {category})
})

app.post('/category/:id/edit', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const name = req.body.name
  const id = req.params.id
  const db = await openDb()
  const category = await db.get(`
    UPDATE categories
    SET cat_name = ?
    WHERE cat_id = ?
  `,[name,id])
  res.redirect(302,'/categories')
})

app.post('/category/:id/delete', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const id = req.params.id
  const db = await openDb()
  const category = await db.get(`
    DELETE FROM categories
    WHERE cat_id = ?
  `,[id])
  res.redirect(302,'/categories')
})


app.get('/:cat?', async (req, res) => {
  const db = await openDb()
  const categoryActive = req.params.cat ? req.params.cat : 'home'
  const categories = await db.all(`
    SELECT * FROM categories
  `)
  const categoryObjectActive = categories.find(({cat_id}) => cat_id.toString() === categoryActive)
  let posts = []
  if(categoryActive === "home"){
    posts = await db.all(`
    SELECT * FROM posts
    LEFT JOIN categories on categories.cat_id = posts.category
  `)
  } else {
    posts = await db.all(`
      SELECT * FROM posts
      LEFT JOIN categories on categories.cat_id = posts.category
      WHERE category = ?
  `, [categoryActive])
  }
  res.render("blog",{categories: categories, categoryActive: categoryObjectActive, posts: posts, logged: req.session.logged, numuser: req.session.numuser})
})



app.listen(port,  () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

