HGOP - Report
==========

# Dagur 1 / Tól

Lítil umfjöllun um þau tól sem ég nýti mér í þessu verkefni til að ná fram sjálfvirknivæðingu hugbúnaðar þróunar.

#### Vagrant
Með þessu tóli er hægt að skilgreina eina config skrá sem segir til um hvernig þróunarumhverfi þú vilt hafa til að þróa hugbúnaðinn þinn, og með einni skipun "vagrant up" byggir Vagrant upp umhverfi á sýndarvél sem þú hefur svo aðgang að. Með hjálp þessa tóls er hægt að eyða "Þetta virkaði á minni vél" afsökuninni, þar sem við getum sett kerfið upp á sýndarvél sem virkar eins og vél endanotenda í hverri útgáfu.

#### VirtualBox
VirtualBox er pallur til að keyra upp sýndarvélar innan í þinni eigin vél, tólið sér um að sýndarvélin fái allar þær auðlindir til að virka eins og skyldi og sér einnig um að einangra hana frá þínu stýrikerfi svo virðist sem að þetta sé fullkomnlega einstæð vél.

#### Grunt
Þetta tól er hægt að nýta sér til sjálfvirknivæðingar á þróun hugbúnaðar. Með Grunt er hægt að stilla upp verkefnum sem þarf að keyra við þýðingu og meðhöndlun kóðans þíns. Þegar Grunt er stillt að þínum þörfum þarf að keyra skipunina "Grunt" og tólið sér um að gera allt fyrir þig. Að kunna vel á þetta tól getur sparað töluverðan tíma sem annars færi í að gera hlutina handvirkt í hvert einasta skipti.

#### npm
Npm er pakkastjóri, en með því er auðveldlega hægt að sækja utanaðkomandi söfn/pakka/viðbætur. Npm sér einnig um að halda utan um ánauðar kerfisins, og með einni skiptun "npm install" er auðveldlega hægt að ná í alla ánauðar sem kerfið þarfnast til að geta keyrt.

#### nodejs
NodeJS er JavaScript keyrslu umhverfi sem keyrir í Javascript (V8) sýndarvél. NodeJs er ekið áfram af atburðum (event driven) og eins þráðar (single threaded) svo eitthvað sé nefnt. NodeJs er vinsæll valkostur þegar kemur að þróun vefþjónusta/bakenda.

#### bower
Bower tólið er ekki ósvipað npm, sér um að sækja söfn/pakka/viðbætur um viðhalda ánauðum kerfis. Helsti mismunur tólanna er að Npm er yfirleitt notað fyrir pakka sem tengjast Nodejs (bakenda kerfis) á meðan Bower er notað fyrir pakka til þróunar framenda.

# Dagur 2 / Deployment path
Til að allt gangi hiklaust fyrir sig þurfa báðar vélarna að vera keyrandi, en af þær eru það ekki er hægt að keyra `vagrant up` í þeirri möppu sem Vagrantfile skjalið er staðsett.

## dockerbuild.sh
Script sem byggir kerfið upp og keyrir prófanir, ef allt gengur upp þá er búin til Docker image. Áður en þessi scripta er keyrð þarf að vera búið að niðurhala öllum ánuðum kerfisins, en það er gert með `npm install` og eftir það `bower install`. Einnig þarf að búa til aðgang á Docker Hub og skrá sig inn með `docker login`, eftir það þarf þá breyta *{notendanafn}* í scriptunni í það notendanafn sem þú valdir þér.

``` shell
#!/bin/bash -e

echo Cleaning...
rm -rf ./dist

echo Building app
grunt

cp ./Dockerfile ./dist/

cd dist
npm install --production

echo Building docker image
docker build -t {notendanafn}/tictactoe .

echo "Done"

```

## dockerpush.sh
Script sem ýtir nýjustu útgáfu Docker frá dev vélinni og sækir frá Docker og ræsir á test vélinni, ætti að vera keyrð eftir dockerbuild.sh ef allt gekk upp. Til að scriptan virki þarf test vélin að hafa ip slóðina 192.168.33.10 (í þessu tilfelli), það er gert með því að bæta þessari línu við í Vagrantfile test vélarinnar:
`config.vm.network "private_network", ip: "192.168.33.10"`

Einnig þarf að bæta við dev vélinni í hóp þeirra véla sem test vélin treystir, og þarf þar af leiðandi ekki að auðkenna sig ef hún reynir að hafa aðgang af sér í gegnum SSH tengingu. Ég náði þessu fram með [þessum](http://www.linuxproblem.org/art_9.html) leiðbeiningum, mjög skýrar og þægilegar.

``` shell
#!/bin/bash -e

echo "______________________________________"

echo Pushing docker image
docker push {notendanafn}/tictactoe
echo "______________________________________"

echo \(TestMachine\) Stopping and removing old processes
ssh 192.168.33.10 'docker stop $(docker ps -a -q)'
ssh 192.168.33.10 'docker rm $(docker ps -a -q)'
echo "______________________________________"

echo \(TestMachine\) Pulling docker image
ssh 192.168.33.10 'docker pull {notendanafn}/tictactoe'
echo "______________________________________"

echo \(TestMachine\) Starting the new image
ssh 192.168.33.10 'docker run -p 9000:8080 -d -e "NODE_ENV=production" {notendanafn}/tictactoe'
echo "______________________________________"

echo "Done"
```
#### Skref fyrir skref
Allar skipanir með forskeytinu `ssh 192.168.33.10` eru keyrðar á test vélinni með SSH tengingu frá dev vélinni.

1. `docker push {notendanafn}/tictactoe`: Ýtir nýjustu útgáfu af docker image kerfisins á Docker Hub.
2. `ssh 192.168.33.10 'docker stop $(docker ps -a -q)'`: Stöðvar alla fyrrum Docker gáma.
3. `ssh 192.168.33.10 'docker rm $(docker ps -a -q)'`: Eyðir öllum fyrrum Docker gámum.
4. `ssh 192.168.33.10 'docker pull {notendanafn}/tictactoe'`: Sækir nýjustu docker image kerfisins frá Docker Hub.
5. `ssh 192.168.33.10 'docker run -p 9000:8080 -d -e "NODE_ENV=production" {notendanafn}/tictactoe'`: Keyrir upp nýjan gám með nýsóttu docker image kerfisins.

# Dagur 9 / Load tests
Eftir Acceptance prófanirnar keyrir Jenkins load/capacity prófanir, til að athuga hvernig þjónninn höndlar álag á þeirri vél sem keyrt er á. Fyrst lét ég þjóninn spila 1000 leiki og höndlaði hann það ekki nægilega vel, það tók hann vel upp í 30-40 sekúndur. Ég fækkaði leikjunum alveg niður í 200, en þá var þjónninn farinn að geta spilað þá á ásættanlegum tíma. Ég keyrði prófinn nokkrum sinnum og yfirleitt var hann 5 sekúndur, hann fór einu sinni upp í 6 svo ég setti þröskuldinn 25% hærra en það, á 7,5 sekúndur (7500 millisekúndur). Ef það tekur þjóninn lengur en það að spila 200 leiki stenst hann ekki prófanir og framleiðslulínan stöðvar.

Uppfærsla: Það var að koma fyrir að 7,5 sekúnda var ekki nægilegur tími, svo ég jók hann upp í 8 sekúndur, það virðist vera flottur þröskuldur.

Leikirnir 200 eru spilaðir "samtímis", þ.e. það er ekki spilað allan fyrsta leikinn út til enda áður en leikur númer tvö byrjar. Þar sem við erum að keyra í NodeJS og það er eins þráðar (single threaded) og keyrir asynchronous, þá heldur forritið áfram að senda skipanir á þjóninn þó svo að hann hafi ekki endilega klárað að framkvæma síðasta kall.

# Dagur 10 / traceability, production env, and deploy any version
* "What does this give us? Who would use the capability to track versions and why? Who would use capability to deploy any version and why?"
  - Þetta gefur okkur skýra heildarmynd yfir útgáfur kerfisins og sögu hverrar útgáfu. Það að halda utan um útgáfur nýtist þeim sem nota kerfið okkar í sínu eigin kerfi, sem vefþjónustu til dæmis. Fyrir þá er gott að sjá nýjar útgáfur og hvort uppfærslur brjóti kerfið þeirra til að mynda. Við sem smiðir hugbúnaðarins getum svo nýtt okkur eiginleikan að geta bakkað/uppsett gamlar útgáfur af kerfinu, til dæmis ef ný uppfærsla fer úrskeiðis þá er gott að geta bakkað í örugga útgáfu með einum músarsmell.
* "What was wrong with having docker push in the deployment script rather than in the dockerbuild.sh script?"
  - Það átti í raun bara ekki við (seperation of concern). Við eigum að geta nýtt deployment script-una oft, til að keyra upp kerfið á mörgum vélum, án þess að vera að ýta docker myndinni uppá dockerhub í hvert skipti, það þarf aðeins einu sinni og það er eftir að hafa byggt myndina (dockerbuild.sh).
* "How does the "deploy any version, anywhere" build feature work? Hint: Track GIT_COMMIT"
  - Með því að halda utan um git commit færslunúmerið við hvert build. Þegar við byggjum kerfið þá búum við til docker mynd og töggum hana með git commit færslunúmerinu, og ýtum upp á dockerhub, svo ef við viljum einhverntíman rúlla til baka í gamla útgáfu (gamalt commit) þá getum við náð í þá docker mynd með viðeigandi tag með einum músarsmell.

# Wrap up / Jenkins stages and scripts
#### Commit Stage
Þegar þetta stig hefur lokið keyrslu á sínum scripts, þá geymir hann skránna `dist/githash.txt` sem öll hin stigin geta svo afritað til notkunar.
``` shell
export DISPLAY=:0
./dockerbuild.sh agirmar $GIT_COMMIT
```
#### Acceptance Stage
1) 
``` shell
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)
env
chmod +x dockerdeploy.sh
./dockerdeploy.sh agirmar $GIT_UPSTREAM_HASH 192.168.33.10 9000
```
2)
``` shell
sudo npm install
./acceptanceTests.sh 192.168.33.10 9000
```
#### Load Stage
``` shell
chmod +x loadTests.sh
sudo npm install
./loadTests.sh 192.168.33.10 9000
```

#### Deploy Product
``` shell
export GIT_UPSTREAM_HASH=$(<dist/githash.txt)
env
chmod +x dockerdeploy.sh
./dockerdeploy.sh agirmar $GIT_UPSTREAM_HASH 192.168.33.10 9001
```

#### The pipeline
![alt tag](https://github.com/agirmar92/hgop2015/blob/master/images/pipeline.png)
