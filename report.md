HGOP - Report
==========
Lítil umfjöllun um þau tól sem ég nýti mér í þessu verkefni til að ná fram sjálfvirknivæðingu hugbúnaðar þróunar.

#### Vagrant
Með þessu tóli er hægt að skilgreina eina config skrá sem segir til um hvernig þróunarumhverfi þú vilt hafa til að þróa hugbúnaðinn þinn, og með einni skipun "vagrant up" byggir Vagrant upp umhverfi á sýndarvél sem þú hefur svo aðgang að.

#### VirtualBox
VirtualBox er pallur til að keyra upp sýndarvélar innan í þinni eigin vél, tólið sér um að sýndarvélin fái allar þær auðlindir til að virka eins og skyldi og sér einnig um að einangra hana frá þínu stýrikerfi svo virðist sem að þetta sé fullkomnlega einstæð vél.

#### Grunt
Þetta tól er hægt að nýta sér til sjálfvirknivæðingar á þróun hugbúnaðar. Með Grunt er hægt að stilla upp verkefnum sem þarf að keyra við þýðingu og meðhöndlun kóðans þíns. Þegar Grunt er stillt að þínum þörfum þarf að keyra skipunina "Grunt" og tólið sér um að gera allt fyrir þig.

#### npm
Npm er pakkastjóri, en með því er auðveldlega hægt að sækja utanaðkomandi söfn/pakka/viðbætur. Npm sér einnig um að halda utan um ánauðar kerfisins, og með einni skiptun "npm install" er auðveldlega hægt að ná í alla ánauðar sem kerfið þarfnast til að geta keyrt.

#### nodejs
NodeJS er JavaScript keyrslu umhverfi sem keyrir í Javascript (V8) sýndarvél. NodeJs er ekið áfram af atburðum (event driven) og eins þráðar (single threaded) svo eitthvað sé nefnt. NodeJs er vinsæll valkostur þegar kemur að þróun vefþjónusta/bakenda.

#### bower
Bower tólið er ekki ósvipað npm, sér um að sækja söfn/pakka/viðbætur um viðhalda ánauðum kerfis. Helsti mismunur tólanna er að Npm er yfirleitt notað fyrir pakka sem tengjast Nodejs (bakenda kerfis) á meðan Bower er notað fyrir þróun framenda.
