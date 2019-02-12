const express = require('express');
const app = express();

const db = require('./db.js');
const { Content, Page } = db.Models;

module.exports = app;

const renderNav = (pages, page) => {
    return `
        <ul class="nav nav-tabs">
            ${pages.map( _page => {
                return `
                    <li class='nav-item'>
                        <a href='/pages/${_page.id}' class='nav-link ${page.id === _page.id ? 'active' : ''}'>
                        ${_page.name}
                        </a>
                    </li>
                `;
            }).join('')
        }
        </ul>
    `;
}

const renderContents = (page) => {
    return `
        <ul class='list-group'>
            ${page.contents.map( content => {
                return `
                    <li class='list-group-item'>
                        ${content.title}
                        <br>
                        ${content.body}
                    </li>
                `;
            }).join('')
        }
        </ul>
    `;
}

const renderHTML = (pageName, pages, page) => {
    return ` 
    <!DOCTYPE html>
    <html>
        <head>
            <link rel='stylesheet' type='text/css'href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'>
            <title> Acme Web : ${pageName} </title>
            <style>
                body {
                    background-color: #1f2833;
                    color: #66fcf1;
                }
                
                h1 {color: #d1e8e2;}

                .nav-item > a {
                    color: #45a293;
                }

                .list-group > li {
                    background-color: #2c3531;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>Acme Web</h1>
                <h2>${pageName}</h2>
                ${renderNav(pages, page)}
                ${renderContents(page)}
            </div>
        </body>

    </html>

`};

app.use((req, res, next) => {
    Page.findAll()
        .then( pages => {
            req.pages = pages;
            next();
        })
        .catch(next);
})

app.get('/', (req, res, next) => {
    Page.findOne({
        where: {name: 'Home'}
    })
    .then( page => res.redirect(`/pages/${page.id}`))
    .catch(next);
})

app.get('/pages/:id', (req, res, next) => {
    const { params: { id } } = req;
    let pageName;
    Page.findByPk(parseInt(id), {
            include: Content
        })
        .then(page => {
            //just want the name so I can put it in <h2> tags lol
            pageName = page;
            const { name } = pageName;
            res.send((renderHTML(name, req.pages, page)))
        })
        // .then(page => res.send((renderHTML(req.pages, page))))
        .catch(next);
});
