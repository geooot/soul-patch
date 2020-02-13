# soul-patch
A HTML templator with angular like syntax. Generating HTML through means that are not efficient, or safe. Only really good for shady static site generation.

If moustache and handlebars are real templating engines, then soul-patch is it's wierd distant cousin.

## Installation
```bash
$ npm install @geooot/soul-patch
```

## Usage
```javascript
const { renderPage } = require('@geooot/soul-patch');
const template = `
    <ul sp-for="let i=0; i<3; i++">
        <li sp-assign="text: foo + someFunc(i), class: 'whatever'"></li>
    </ul>
`
let rendered = await renderPage({
    input: template,
    props: {
        foo: "The number is: ",
        someFunc: (num) => num * 100
    }
});

console.log(rendered);
// Results in:
// <ul>
//     <li class="whatever">The number is: 0</li>
//     <li class="whatever">The number is: 100</li>
//     <li class="whatever">The number is: 200</li>
// </ul>
```

## Operators
Operators allow you to template html by adding special attributes to your HTML. Here are the available operators:

### `sp-assign`
This property allows you to assign variables to HTML attributes and set HTML.
    
#### Example 1

This template:
```html
<p sp-assign="text: someVariable, class: someBool ? 'text-green' : 'text-red'">Whatever</p>
```
Results in:
```html
<p class="text-red">I was a string assigned to someVariable</p>
```

#### Example 2: Using innerHTML
This template:
```html
<p sp-assign="innerHTML: markdownToHTML(markdownInAString)"></p>
```
Results in:
```html
<p><h1>Here is some raw HTML being injected!!!</h1><p>wowzers</p></p>
```

### `sp-for`
Defines how you can create a loop of elements. 

#### Example 1: For loop
This template:
```html
<ul sp-for="let i=0; i<10; i++">
  <li sp-assign="text: i, class: 'whatever'">
    Anything can go here but it will probably be replaced on render
  </li>
</ul>
```
Results in:
```html
<ul>
  <li class="whatever">0</li> 
  <li class="whatever">1</li> 
  <li class="whatever">2</li> 
  <li class="whatever">3</li> 
  <li class="whatever">4</li> 
  <li class="whatever">5</li> 
  <li class="whatever">6</li> 
  <li class="whatever">7</li> 
  <li class="whatever">8</li> 
  <li class="whatever">9</li> 
</ul>
```

#### Example 2: For each loop
This template
```html
<div sp-for="item of listOfObjects">
  <p sp-assign="text: item.name, id: item.id">Whatever</p>
</div>
```
Results in
```html
<div>
  <p id="someIdFoo">Foo</p>
  <p id="someIdBar">Bar</p>
  <p id="someIdWiz">Wiz</p>
</div>
```

### `sp-render-if`
Renders an item if a certain condition is true

#### Example
This template:
```html
<p sp-render-if="10 < 100">Turns out 10 is less than 100 so this will render</p>
<p sp-render-if="myIQ > averageIQForAge(19)">But my IQ is below average so this will not render</p>
```

Results in:
```html
<p>Turns out 10 is less than 100 so this will render</p>
```