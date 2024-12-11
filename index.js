var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const path = require('path');
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => { 
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/api/fileanalyse',upload.single('upfile') ,function (req, res) {
  //res.send('Bien!');
  const file = req.file;
  if (!file) { 
    return res.status(400).json({ error: 'No file uploaded' }); 
  }
  // Crear los metadatos del archivo
  const fileMetadata = { 
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  };
  // Devolver los metadatos  JSON 
  res.json(fileMetadata);
});

app.get('/', function (req, res) {
   res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
