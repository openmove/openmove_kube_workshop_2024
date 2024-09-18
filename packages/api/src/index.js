const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');

// Register fastify-multipart for handling file uploads
fastify.register(require('fastify-multipart'));

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/filedb'; // Change this URI to your MongoDB instance

// Mongoose connection
let gfs;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads'); // Set the GridFS collection name
});

// Route to handle file upload
fastify.post('/upload', async (req, reply) => {
  const data = await req.file();
  const fileStream = new Readable();

  fileStream.push(await data.toBuffer()); // Read file into buffer
  fileStream.push(null); // End the stream

  const writeStream = gfs.createWriteStream({
    filename: data.filename,
    content_type: data.mimetype
  });

  // Pipe the file data into GridFS
  fileStream.pipe(writeStream);

  writeStream.on('close', (file) => {
    reply.send({ status: 'success', message: 'File uploaded', fileId: file._id });
  });

  writeStream.on('error', (err) => {
    reply.code(500).send({ status: 'error', message: err.message });
  });
});

// Route to retrieve an uploaded file
fastify.get('/files/:filename', async (req, reply) => {
  const { filename } = req.params;

  // Search for the file in GridFS
  gfs.files.findOne({ filename }, (err, file) => {
    if (!file || file.length === 0) {
      return reply.code(404).send({ error: 'File not found' });
    }

    // Create read stream and pipe to response
    const readStream = gfs.createReadStream({ filename });
    reply.header('Content-Disposition', `attachment; filename=${filename}`);
    readStream.pipe(reply.raw);
  });
});

// Start the Fastify server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();