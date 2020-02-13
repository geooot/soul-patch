const stubble = require('../../dist/index');

stubble.renderSite({
    pages: [{
        inputFile: "./src/index.html",
        outputFile: "./output/index.html",
        props: {
            takes: [
                { href: "https://example.com", text: "Toast only tastes good when toasted on a pan" },
                { href: "https://whatlol.com", text: "Spaces > Tabs" },
                { href: "https://www.imdb.com/title/tt0368226/", text: "The Room is a cinematic masterpiece" },
            ],
            accomplishments: []
        }
    }],
    staticFolders: [{
        from: "./src/static",
        to: "./output/static"
    }]
}).then(() => {
    console.log("done did it!")
})