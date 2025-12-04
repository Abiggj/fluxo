const { app, prisma } = require('./app');
const port = process.env.PORT || 3000;

const main = async () => {
  try {
    await prisma.$connect();
    console.log('DB connection successful');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database');
    console.error(error);
    process.exit(1);
  }
};

main();