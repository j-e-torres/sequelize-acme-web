const express = require('express');
const app = express();

const db = require('./db.js');
const { Content, Page } = db.Models;
const PORT = process.env.PORT || 3002;

db.seedDB();

const renderPage = (pages, page) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <title> Acme Web </title>

        </head>

        <body>
            <ul>
                ${pages.map(_page => {
                    return `
                        <li>
                            <a href='/pages/${_page.id}>
                                ${page.name}
                            </a>
                        </li>
                    `;
                }).join('')
            }
            </ul

            <ul>
                ${page.contents.map( content => {
                    return `
                        <li>
                            ${content.title}
                            ${content.body}
                        </li>
                    `;
                }).join('')
            }

            </ul>
        </body>
    </html>
    `;
}

// app.use((req, res, next) => {
//     Page.findAll()
//         .then( pages => {
//             req.pages = pages;
//             next();
//         })
//         .catch(next);
// })

app.get('/', (req, res, next) => {
    Page.findAll({
        include: Content
    })
    .then( () => { Page.findOne({
        where: {name: 'Home'}
        })
    })
    .then( page => res.redirect(`/pages/${page.id}`))
    .catch(next);
})

app.get('/pages/:id', (req, res, next) => {
    const { params: { id } } = req;

    const pages = Page.findAll({
        include: Content
    });

    const page = Page.findByPk(parseInt(id), {
            include: Content
        })
        .then(page => res.send((page)));

    res.send(renderPage(pages, page));
    });


app.listen(PORT, () => {
    console.log(`Listening to ${PORT} and db is seeded`);
})

