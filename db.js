const Sequelize = require('sequelize');
const connect = new Sequelize('postgres://localhost/sequelacmeweb2')

//route helpers
// const getPages = () => {
//     Page.findAll()
//         .then( pages => {
//             req.pages = pages;
//         })
// }

//models
const Content = connect.define('content', {
    title: { type: Sequelize.STRING, allowNull: false },
    body: { type: Sequelize.TEXT },
});

const Page = connect.define('page', {
    name: { type: Sequelize.STRING, allowNull: false }
});

// connect.sync({ force: true })
const seedDB = async () => {
    Page.hasMany(Content);
    Content.belongsTo(Page);

    try {
        await connect.sync({ force: true });

        const [homePage, employeesPage, contactPage] = await Promise.all([
        Page.create({name: 'Home'}),
        Page.create({name: 'Employees'}),
        Page.create({name: 'Contact'}),
        ]);
        //home content
        const welcomeHome1 = await Content.create({ title: 'Welcome Home 1', body: 'xoxoxo' });
        const welcomeHome2 = await Content.create({ title: 'Welcome Home 2', body: 'xoxoxo'} );

        //employee content
        const employeeMoe = await Content.create( {title: 'MOE', body: 'CEO'} );
        const employeeLarry = await Content.create( {title: 'LARRY', body: 'CTO'} );
        const employeeCurly = await Content.create( {title: 'CURLY', body: 'COO'} );

        //contact content
        const contactPhone = await Content.create( {title: 'Phone', body: '212-555-1212'});
        const contactTelex = await Content.create( {title: 'Telex', body: '212-555-1213'});
        const contactFax = await Content.create( {title: 'Fax', body: '212-555-1214'});

        //set home page
        const homeContent1 = await welcomeHome1.setPage(homePage);
        const homeContent2 = await welcomeHome2.setPage(homePage);

        //set employee page
        const moeContent = await employeeMoe.setPage(employeesPage);
        const larryContent = await employeeLarry.setPage(employeesPage);
        const curlyContent = await employeeCurly.setPage(employeesPage);

        //set contact page
        const phoneContent = await contactPhone.setPage(contactPage);
        const telexContent = await contactTelex.setPage(contactPage);
        const faxContent = await contactFax.setPage(contactPage);
    }
    catch (err) {console.log(err)}
};

module.exports = {
    Models: {Content, Page},
    seedDB,
    // getPages
}
