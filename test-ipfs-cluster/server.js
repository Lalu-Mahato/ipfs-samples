const express = require('express');
const fs = require('fs');
const multer = require('multer');
const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient.create({
  host: "localhost",
  port: 5001,
  protocol: "http",
  headers: {
    Authorization: 'Basic ' + Buffer.from('nstuser:NSTuser@123').toString('base64')
  }
});

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' })

app.post('/share', upload.single('avatar'), async (req, res) => {
  try {
    const { path, filename } = req.file;
    const data = await fs.promises.readFile(path);
    const { cid } = await ipfs.add({ path: filename, content: data }, { pin: true });

    // Delete local file
    await fs.promises.unlink(path);

    const url = `https://ipfs.io/ipfs/${cid}`;
    return res.send({ url });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

const addFile = async (file) => {
  const { path, filename } = file;
  const data = await fs.promises.readFile(path);
  const { cid } = await ipfs.add({ path: filename, content: data }, { pin: true });

  // Delete local file
  await fs.promises.unlink(path);
  console.log(cid);
  return `${cid}`;
}

async function addMultipleFiles(files) {
  const addedFiles = [];

  for await (const addedFile of ipfs.addAll(files)) {
    addedFiles.push(`${addedFile.cid}`);
  }

  return addedFiles;
}

app.post('/multiple-files', upload.array('images'), async (req, res) => {
  try {

    const files = req.files;
    const cids = files.map(async (file) => await addFile(file));
    console.log('cid: ', cids);
    const data = await Promise.all(cids);
    return res.send({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});


async function accessLargeFile(fileCID) {
  try {
    const fileStream = ipfs.cat(fileCID); // Retrieve the file using IPFS cat method
    const chunks = [];

    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }

    const fileData = Buffer.concat(chunks); // Merge chunks into a single buffer

    return fileData;
  } catch (error) {
    console.error('Error accessing large file:', error);
    throw error;
  }
}



app.get('/download/:fileCID', async (req, res) => {
  const { fileCID } = req.params;
  const fileName = 'downloadedFile.jpg'; // Replace with the desired file name

  try {
    const fileData = await accessLargeFile('QmXXuKe2PTfbYnPm1qpDV5T3CkFgrdxTiFhhEhC9YZ2AV8');
    res.set('Content-Disposition', `attachment; filename="${fileName}"`);
    res.set('Content-Type', 'image/jpeg');
    res.send(fileData);
  } catch (error) {
    console.error('Error accessing large file:', error);
    res.status(500).send('Error accessing large file');
  }
});


app.get('/download-10101/:CID', async (req, res) => {
  try {
    const CID = req.params.CID;

    const fileName = 'downloadedFile.jpg';
    const fileData = await accessLargeFile('QmXXuKe2PTfbYnPm1qpDV5T3CkFgrdxTiFhhEhC9YZ2AV8');

    // for await (const buf of ipfs.get(CID)) {
    //     // do something with buf
    //     console.log('Data', buf);
    // }

    // const exists = (await ipfs.get('QmcacMmCmfycBCGKYA4GRtPhV2yo1xNcoWxvAcoun3AfjA')).next() !== null;

    // const fileData = await accessLargeFile(fileCID);
    res.set('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileData);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});


app.get('/verify/:cid', async (req, res) => {
  try {
    // Fetch the CID from IPFS
    // const cid = 'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF'; // unknown

    // const cid = 'Qmevek9KV1b9uyHEAEqf3F3Su5Sj2FGUpgYdNJzdcD7Cbc'; // invalid

    // const cid = 'QmS91D3ZY1TPqJyVmPNjniCNFnYk1hFg7JucrDPcc8tPvd'; // infura

    const cid = 'QmaVhUnehH5xbxSQQa9iQRg92xopEF1RmDCxxRz1eC6YG5'; // local

    // let exists = await ipfs.object.get(cid);
    let exists = await ipfs.key.list(cid);
    // let exists = await ipfs.dag.get(cid);
    // console.log('exists: ', exists);

    res.send('exists');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => console.log(`Server listening on port:${port}`));
