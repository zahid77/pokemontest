# Random-Pokemon-Generator

## Description

Forked from [Nerdydrews Random Pokemon Generator](https://github.com/nerdydrew/Random-Pokemon-Generator). This is an alternative version which also has an REST API. 

Demo: <https://grape-deserted-stamp.glitch.me/api?t=all&n=5&r=kanto>

## Installation


### Using just the webpage

1. Clone the repository.
2. Download and unzip the sprites into a sprites folder within the cloned repository.
3. Use any local web server—it's all static.

### REST API

1. Clone the repository.
2. Download and unzip the [sprites](https://randompokemon.com/sprites/sprites.zip) into a `sprites` folder within the cloned repository.
3. If not already done, install [nodejs](https://nodejs.org/en/)
4. run the server with `node backend.js`
5. go to `http://localhost:3000` you should see the webpage.
6. query the rest api with `http://localhost:3000/api?query` in which query, your request string is (see [API Documentation](#api-documentation))
7. have fun
  




Just to clarify this is an REST API Level 0 implementation - according to [Richard Maturity Model](https://en.wikipedia.org/wiki/Richardson_Maturity_Model)

## API Documentation

### Some Taxonomy / Definitions

<dl>
  <dt><strong>API Key and Alias: </strong></dt>
  <dd>use those as keys in a get request to perform the REST-API request.</dd>
  <dt><strong>Category: </strong></dt>
  <dd> An API Key can either influence the <strong>pool</strong> of random pokemon or toggles a <strong>property</strong> like an additional sprite. </dd>
  <dt><strong>Pool</strong></dt>
  <dd>Pool is defined as the set of pokemons that fits the given criteria.  The random pokemon will then be drawn from that pool.</dd>
  <dt><strong>Properties</strong></dt>
  <dd>Properties like sprite (y/n) are additional data, that can be included into the resuls (like images).</dd>
</dl>

| Name | Category | API Key  | Alias  | Values |Description  |  Default Value |  Example  |
| --- |---| --- | ---|---|---|---|--- | 
|Amount of Random Pokemon| Property | number  | n  | 1-6  | The number of random generated pokemon  | - | `n=5` |
|  Sprite | Property |  sprites  | s  |  [Booleanmapping](#booleanmapping) | Imagine a Red Rectangle flirting with you furiously | `false` | `s=false`  |
|Pokemon Region | Pool  | region  | r  | [RegionList](#valid-regions)  | The pokemon region e.g kanto, johto etc. | `all` |  `r=kanto`  |
|Pokemon Type | Pool| type  |  t |   [TypeList](#valid-types)|    Type of the random pokemons. Only single values are allowed. No concatinations like (water,fire) | `all`| `t=bug` |
|Overpowered Pokemon | Pool | ubers  |  u |  [Booleanmapping](#booleanmapping) |  Controls if Overpowered Pokémon (not used in standard play) are added into the pool. |  `false` | `u=true` |
|Include Not fully envolved Pokemon |  Pool | nfes  |  nf | [Booleanmapping](#booleanmapping)  |  Controls, if Pokemon that are not fully envolved are added into the pool. |  `false` |  `nf=false` |
|Pokemon Nature | Property | natures  |  na |  [Booleanmapping](#booleanmapping) | Adds  nature attributes to the drawn random pokemon |  `false` | `na=true` |
|Pokemon Alternative Forms |  Pool | forms  |  f | [Booleanmapping](#booleanlist)  | Allow alternate forms, such as Mega Evolutions.  | `false`  | `f=false` |

### Type of Errors

<dl>
  <dt>Invalid Range</dt>
  <dd> The value is not in the range of the key property e.g. amount (1-6)</dd>
  <dt>Invalid Key</dt>
  <dd>The key is not a valid api key.</dd>
  <dt>No Amount Given</dt>
  <dd>The number key (amount of to be generated pokemon) is mandatory. Please add 'n="number"' to your query.</dd>
</dl>

### BooleanMapping

<dl>
  <dt></dt>
  <dd> yes, true --> true </dd>
  <dd> no, false --> false </dd>
</dl>

### Valid Regions

<dl>
  <dt></dt>
  <dd> all, kanto, johto, hoenn, sinohh, sinnoh_pt (platin), unova, unova_b2w2 (black & white 2), kalos, alola </dd>
</dl>

### Valid Types


<dl>
  <dt></dt>
  <dd> all, bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water </dd>
</dl>



