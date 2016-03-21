// Downloads DB dump from bungie manifest and creates our definition files
// Taken and modified from kyleshays DIM repo
// https://github.com/kyleshay/DIM/blob/master/build/processBungieManifest.js

var http = require('http');
var fs = require('fs');
var request = require('request');
var sqlite3 = require('sqlite3').verbose();
var unzip = require('unzip');

function writeDefinitionFile(path, name, data) {
  var stream = fs.createWriteStream(path);
  stream.write('/* exported ' + name + ' */\n\n');
  stream.write('var ' + name + ' = ');
  stream.write(JSON.stringify(data, null, 2));
  stream.write(';');
  stream.end();
}

function onManifestRequest(error, response, body) {
  var parsedResponse = JSON.parse(body);
  var version = parsedResponse.Response.version;

  for (var language in parsedResponse.Response.mobileWorldContentPaths) {
    console.log('Downloading zip for ' + language + '.');
    var zip = 'manifest/' + language + '/manifest.zip';
    (function (zip, language) {
      request
        .get('https://www.bungie.net' + parsedResponse.Response.mobileWorldContentPaths[language])
        .pipe(fs.createWriteStream(zip))
        .on('close', function () {
          onManifestDownloaded(zip, language);
        });
    })(zip, language);
  }
}

function onManifestDownloaded(zip, language) {
  console.log('Processing zip for ' + language);
  fs.createReadStream(zip)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var path = 'manifest/' + language + '/' + entry.path;
      ws = fs.createWriteStream(path)
      ws.on('finish', function () {
        if (fs.existsSync(path)) {
          extractDB(path, language);
        }
      });
      entry.pipe(ws);
    });
}

function extractDB(dbFile, language) {
  db = new sqlite3.Database(dbFile);

  db.all('SELECT * FROM DestinyInventoryItemDefinition', function(err, rows) {
    if (err) throw err;

    var DestinyArmorDefinition = {};
    var DestinySubclassDefinition = {};
    var DestinyWeaponDefinition = {};

    rows.forEach(function(row) {
      var item = JSON.parse(row.json);

      // Armor
      if ((item.itemType === 2) || (item.itemTypeName === 'Mask')) {
        DestinyArmorDefinition[item.itemHash] = {};
        DestinyArmorDefinition[item.itemHash].name = item.itemName;
        DestinyArmorDefinition[item.itemHash].description = item.itemDescription;
        DestinyArmorDefinition[item.itemHash].icon = item.icon;
        DestinyArmorDefinition[item.itemHash].tierType = item.tierType;
      }

      // Weapons
      if ((item.itemType === 3) && (item.bucketTypeHash !== 2422292810)) {
        DestinyWeaponDefinition[item.itemHash] = {};
        DestinyWeaponDefinition[item.itemHash].name = item.itemName;
        DestinyWeaponDefinition[item.itemHash].icon = item.icon;
        DestinyWeaponDefinition[item.itemHash].subType = item.itemSubType;
        DestinyWeaponDefinition[item.itemHash].tierType = item.tierType;
      }

      switch (item.bucketTypeHash) {
        // Subclass
        case 3284755031:
          DestinySubclassDefinition[item.itemHash] = {};
          DestinySubclassDefinition[item.itemHash].name = item.itemName;
          break;
      }
    });

    /*
    if (!(4097026463 in DestinyWeaponDefinition)) {
      DestinyWeaponDefinition[4097026463] = {
        name: 'No Time to Explain',
        icon: '/images/weapons/NoTimeToExplain.png',
        subType: 13,
        tierType: 6,
        localIcon: true
      };
    } else {
      console.log('No Time To Explain now exists in the manifest file and the override can be removed.');
    }
    */

    writeDefinitionFile('app/shared/definitions/' + language + '/DestinyArmorDefinition.js',    'DestinyArmorDefinition',    DestinyArmorDefinition);
    writeDefinitionFile('app/shared/definitions/' + language + '/DestinySubclassDefinition.js', 'DestinySubclassDefinition', DestinySubclassDefinition);
    writeDefinitionFile('app/shared/definitions/' + language + '/DestinyWeaponDefinition.js',   'DestinyWeaponDefinition',   DestinyWeaponDefinition);
  });

  db.all('SELECT * FROM DestinyHistoricalStatsDefinition', function(err, rows) {
    if (err) throw err;

    var DestinyMedalDefinition = {};

    rows.forEach(function(row) {
      var item = JSON.parse(row.json);

      // Medals
      if (item.statId.substring(0, 6) === 'medals') {
        DestinyMedalDefinition[item.statId] = {};
        DestinyMedalDefinition[item.statId].statName = item.statName;
        DestinyMedalDefinition[item.statId].statDescription = item.statDescription;
        DestinyMedalDefinition[item.statId].iconImage = item.iconImage;
      }
    });

    writeDefinitionFile('app/shared/definitions/' + language + '/DestinyMedalDefinition.js', 'DestinyMedalDefinition', DestinyMedalDefinition);
  });

  db.all('SELECT * FROM DestinyActivityDefinition', function(err, rows) {
    if (err) throw err;

    var DestinyCrucibleMapDefinition = {};

    rows.forEach(function(row) {
      var item = JSON.parse(row.json);

      // Crucible Maps
      if ((item.activityTypeHash === 3695721985) && (item.activityName !== "") && (item.activityName !== "Rumble")) {
        DestinyCrucibleMapDefinition[item.activityHash] = {};
        DestinyCrucibleMapDefinition[item.activityHash].name = item.activityName;
        DestinyCrucibleMapDefinition[item.activityHash].pgcrImage = 'https://www.bungie.net' + item.pgcrImage;

        var filename = item.activityName.replace(/'/g, '').replace(/ /g, '_').toLowerCase();

        var mapImage = '/assets/img/maps/' + filename + '.jpg';
        if (fs.existsSync('app' + mapImage)) {
          DestinyCrucibleMapDefinition[item.activityHash].mapImage = mapImage;
        }

        var heatmapImage = '/assets/img/heatmaps/' + filename + '.jpg';
        if (fs.existsSync('app' + heatmapImage)) {
          DestinyCrucibleMapDefinition[item.activityHash].heatmapImage = heatmapImage;
        }
      }
    });

    writeDefinitionFile('app/shared/definitions/' + language + '/DestinyCrucibleMapDefinition.js', 'DestinyCrucibleMapDefinition', DestinyCrucibleMapDefinition);
  });

  db.all('SELECT * FROM DestinyTalentGridDefinition', function(err, rows) {
    if (err) throw err;

    var DestinyTalentGridDefinition = {};

    rows.forEach(function(row, index) {
      var nodes = [];
      var item = JSON.parse(row.json);
      for (var n = 0, nlen = item.nodes.length; n < nlen; n++) {
        var nodeDef = item.nodes[n];
        var steps = [];
        for (var s = 0, slen = nodeDef.steps.length; s < slen; s++) {
          steps.push({
            'name': nodeDef.steps[s].nodeStepName,
            'nodeStepHash': nodeDef.steps[s].nodeStepHash,
            'description': nodeDef.steps[s].nodeStepDescription,
            'icon': 'https://www.bungie.net' + nodeDef.steps[s].icon,
            'affectsQuality': nodeDef.steps[s].affectsQuality,
            'perkHashes': nodeDef.steps[s].perkHashes
          });
        }
        nodes.push({
          nodeHash: nodeDef.nodeHash,
          row: nodeDef.row,
          column: nodeDef.column,
          steps: steps
        });
      }
      DestinyTalentGridDefinition[item.gridHash] = nodes;
    });

    writeDefinitionFile('app/shared/definitions/' + language + '/DestinyTalentGridDefinition.js', 'DestinyTalentGridDefinition', DestinyTalentGridDefinition);
  });
}

request.get({
  url: 'https://www.bungie.net/Platform/Destiny/Manifest/',
  headers: {'X-API-Key':'10E792629C2A47E19356B8A79EEFA640'}
}, onManifestRequest);
