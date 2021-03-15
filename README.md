# Random-Pokemon-Generator

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
|  Sprite | Property |  sprites  | s  |  [BooleanList](#booleanlist) | Imagine a Red Rectangle flirting with you furiously | `false` | `s=false`  |
|Pokemon Region | Pool  | region  | r  | [RegionList](#valid-regions)  | The pokemon region e.g kanto, johto etc. | `all` |  `r=kanto`  |
|Pokemon Type | Pool| type  |  t |   [TypeList](#valid-types)|    Type of the random pokemons. Only single values are allowed. No concatinations like (water,fire) | `all`| `t=bug` |
|Overpowered Pokemon | Pool | ubers  |  u |  [BooleanList](#booleanlist) |  Controls if Overpowered Pokémon (not used in standard play) are added into the pool. |  `false` | `u=true` |
|Include Not fully envolved Pokemon |  Pool | nfes  |  nf | [BooleanList](#booleanlist)  |  Controls, if Pokemon that are not fully envolved are added into the pool. |  `false` |  `nf=false` |
|Pokemon Nature | Property | natures  |  na |  [BooleanList](#booleanlist) | Adds  nature attributes to the drawn random pokemon |  `false` | `na=true` |
|Pokemon Alternative Forms |  Pool | forms  |  f | [BooleanList](#booleanlist)  | Allow alternate forms, such as Mega Evolutions.  | `false`  | `f=false` |

### Type of Errors

<dl>
  <dt><strong>Invalid Range</strong></dt>
  <dd> The value is not in the range of the key property e.g. amount (1-6)</dd>
  <dt><strong>Invalid Key</strong></dt>
  <dd>The key is not a valid api key.</dd>
  <dt><strong>No Amount Given</strong></dt>
  <dd>The number key (amount of to be generated pokemon) is mandatory. Please add 'n="number"' to your query.</dd>
</dl>

### BooleanList

boolean mapping:

* yes, true --> true
* no, false --> false

### Valid Regions

* all
* kanto
* johto
* hoenn
* sinohh
* sinnoh_pt (platin)
* unova
* unova_b2w2 (black & white 2)
* kalos
* alola

### Valid Types

* all
* bug
* dark
* dragon
* electric
* fairy
* fighting
* fire
* flying
* ghost
* grass
* ground
* ice
* normal
* poison
* psychic
* rock
* steel
* water


This readme will be updated soon.

After some tests, the changes will be merged into the main branch and a wiki for the api will be added.


This is the source code for [randompokemon.com](https://randompokemon.com). To set it up in your own environment, follow the steps below:

1. Clone the repository.
2. Download and unzip the [sprites](https://randompokemon.com/sprites/sprites.zip) into a `sprites` folder within the cloned repository.
3. Use any local web server—it's all static.


