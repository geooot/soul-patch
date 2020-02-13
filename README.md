# stubble
An HTML templator with angular like syntax. Generating HTML through means that are not efficient, or safe. But it gets the job done. Only really good for shady static site generation.

If moustache and handlebars are real templating engines, then stubble is it's wierd distant cousin.

## Installation
```
TODO
```

## Usage
```
TODO:
```

## Operators
Operators allow you to template html by adding special attributes to your HTML. Here are the available operators:

### `sb-assign`
This property allows you to assign variables to HTML attributes and set HTML.
    
#### Example 1

This template:
```html
<p sb-assign="text: someVariable, class: someBool ? 'text-green' : 'text-red'">Whatever</p>
```
Results in:
```html
<p class="text-red">I was a string assigned to someVariable</p>
```

#### Example 2: Using innerHTML
This template:
```html
<p sb-assign="innerHTML: markdownToHTML(markdownInAString)"></p>
```
Results in:
```html
<p><h1>Here is some raw HTML being injected!!!</h1><p>wowzers</p></p>
```

### `sb-for`
Defines how you can create a loop of elements. 

#### Example 1: For loop
This template:
```html
<ul sb-for="let i=0; i<10; i++">
  <li sb-assign="text: i, class: 'whatever'">
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
<div sb-for="item of listOfObjects">
  <p sb-assign="text: item.name, id: item.id">Whatever</p>
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

### `sb-render-if`
Renders an item if a certain condition is true

#### Example
This template:
```html
<p sb-render-if="10 < 100">Turns out 10 is greater than 100 so this will render</p>
<p sb-render-if="myIQ > averageIQForAge(19)">But my IQ is below average so this will not render</p>
```

Results in:
```html
<p>Turns out 10 is greater than 100 so this will render</p>
```