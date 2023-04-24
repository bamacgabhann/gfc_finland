// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('FAO/GAUL/2015/level0');

// Subset Finland from countries.
var finland = countries.filter(ee.Filter.eq('ADM0_NAME', 'Finland'));

// Load global forest cover data for Finland for 2015-2021
var gfc2021 = ee.Image('UMD/hansen/global_forest_change_2021_v1_9').clip(finland);

// Subset tree cover data for 2000 and add in green
var treeCover2000 = gfc2021.select(['treecover2000']);
Map.addLayer(treeCover2000.updateMask(treeCover2000),
    {palette: ['000000', '00FF00'], max: 100}, 'Forest Cover 2000');

// Subset tree cover gain 2000-2012 and add in blue
var gain2012 = gfc2021.select(['gain']);
Map.addLayer(gain2012.updateMask(gain2012),
            {palette: ['0000FF']}, 'Gain 2000-2012');

// Subset tree cover gain 2000-2020 and add in a different blue
//var gain2020 = ee.Image('projects/glad/GLCLU2020/Forest_gain').clip(finland);
//Map.addLayer(gain2020.updateMask(gain2020),
//            {palette: ['00FFFF']}, 'Gain 2000-2020');

// Subset GFC tree cover loss 2000-2021
var gfcLoss = gfc2021.select(['loss']);

// Load Fire data
var fire21 = ee.Image('users/sashatyu/2001-2021_fire_forest_loss/EUR_fire_2001-21_thresh_final').clip(finland);

// Load Loss Year
var lossYear = gfc2021.select(['lossyear']);
var lossYearPost12 = lossYear.updateMask(lossYear.gt(12));

// Split by certainty
var fireMask = fire21.select('b1');
var fire21h = fire21.updateMask(fireMask.eq(4));
var fire21m = fire21.updateMask(fireMask.eq(3));
var fire21l = fire21.updateMask(fireMask.eq(2));
var fire21n = fire21.updateMask(fireMask.eq(1));
var fire21hml = fire21.updateMask(fireMask.gt(1));
var firehmlOnGain12 = fire21hml.updateMask(gain2012);
var fire21hmlOnGain12 = firehmlOnGain12.updateMask(lossYearPost12);

var fireCert =
'<RasterSymbolizer>' +
  '<ColorMap type="intervals" extended="false">' +
    '<ColorMapEntry color="#FF0000" quantity="4" label="High Certainty forest loss due to fire"/>' +
    '<ColorMapEntry color="#FF8000" quantity="3" label="Medium Certainty forest loss due to fire"/>' +
    '<ColorMapEntry color="#FFFF00" quantity="2" label="Low Certainty forest loss due to fire"/>' +
    '<ColorMapEntry color="#FF00BF" quantity="1" label="Forest loss due to non-fire drivers"/>' +
  '</ColorMap>' +
'</RasterSymbolizer>';

// Add the fire loss certainty layers - high in red, medium in orange, low in yellow, non-fire loss in purple
Map.addLayer(fire21h.sldStyle(fireCert), {}, 'GLAD Fire Certainty H');
Map.addLayer(fire21m.sldStyle(fireCert), {}, 'GLAD Fire Certainty M');
Map.addLayer(fire21l.sldStyle(fireCert), {}, 'GLAD Fire Certainty L');
Map.addLayer(fire21n.sldStyle(fireCert), {}, 'GLAD Fire Certainty N');
Map.addLayer(fire21hmlOnGain12.sldStyle(fireCert), {}, 'GLAD Fire Certainty on Gain to 2012');

// Add annual loss layers - uncomment year in top and bottom section if you want to see them
//var fire2001 = fire21.updateMask(lossYear.eq(1));
//var fire2002 = fire21.updateMask(lossYear.eq(2));
//var fire2003 = fire21.updateMask(lossYear.eq(3));
//var fire2004 = fire21.updateMask(lossYear.eq(4));
//var fire2005 = fire21.updateMask(lossYear.eq(5));
//var fire2006 = fire21.updateMask(lossYear.eq(6));
//var fire2007 = fire21.updateMask(lossYear.eq(7));
//var fire2008 = fire21.updateMask(lossYear.eq(8));
//var fire2009 = fire21.updateMask(lossYear.eq(9));
//var fire2010 = fire21.updateMask(lossYear.eq(10));
//var fire2011 = fire21.updateMask(lossYear.eq(11));
//var fire2012 = fire21.updateMask(lossYear.eq(12));
//var fire2013 = fire21.updateMask(lossYear.eq(13));
//var fire2014 = fire21.updateMask(lossYear.eq(14));
//var fire2015 = fire21.updateMask(lossYear.eq(15));
//var fire2016 = fire21.updateMask(lossYear.eq(16));
//var fire2017 = fire21.updateMask(lossYear.eq(17));
//var fire2018 = fire21.updateMask(lossYear.eq(18));
//var fire2019 = fire21.updateMask(lossYear.eq(19));
//var fire2020 = fire21.updateMask(lossYear.eq(20));
//var fire2021 = fire21.updateMask(lossYear.eq(21));

//Map.addLayer(fire2001.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2001');
//Map.addLayer(fire2002.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2002');
//Map.addLayer(fire2003.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2003');
//Map.addLayer(fire2004.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2004');
//Map.addLayer(fire2005.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2005');
//Map.addLayer(fire2006.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2006');
//Map.addLayer(fire2007.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2007');
//Map.addLayer(fire2008.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2008');
//Map.addLayer(fire2009.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2009');
//Map.addLayer(fire2010.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2010');
//Map.addLayer(fire2011.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2011');
//Map.addLayer(fire2012.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2012');
//Map.addLayer(fire2013.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2013');
//Map.addLayer(fire2014.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2014');
//Map.addLayer(fire2015.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2015');
//Map.addLayer(fire2016.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2016');
//Map.addLayer(fire2017.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2017');
//Map.addLayer(fire2018.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2018');
//Map.addLayer(fire2019.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2019');
//Map.addLayer(fire2020.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2020');
//Map.addLayer(fire2021.sldStyle(fireCert), {}, 'GLAD Fire Certainty 2021');

// Extract high, medium, low, and non-fire categories
var gfcFire21h = gfcLoss.updateMask(fireMask.eq(4));
var gfcFire21m = gfcLoss.updateMask(fireMask.eq(3));
var gfcFire21l = gfcLoss.updateMask(fireMask.eq(2));
var gfcFire21n = gfcLoss.updateMask(fireMask.eq(1));

// Calculate area represented by pixels for each category, and total
var fireLoss21h = gfcFire21h.multiply(ee.Image.pixelArea());
var fireLoss21m = gfcFire21m.multiply(ee.Image.pixelArea());
var fireLoss21l = gfcFire21l.multiply(ee.Image.pixelArea());
var fireLoss21n = gfcFire21n.multiply(ee.Image.pixelArea());
var fireLoss21t = gfcLoss.multiply(ee.Image.pixelArea());

// Sum the total value of forest loss pixels in Finland.
var statsfireLoss21t = fireLoss21t.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});
print('pixels representing fireLoss21t: ', statsfireLoss21t.get('loss'), 'square meters');

// Now calculate losses by year: for total, high, medium, low, and non-fire
var lossByYearT = fireLoss21t.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearH = fireLoss21h.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearM = fireLoss21m.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearL = fireLoss21l.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearN = fireLoss21n.addBands(lossYear).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

// Now format the stats by year for easy reading, again for each category
var statsFormattedT = ee.List(lossByYearT.get('groups'))
  .map(function(elT) {
    var dT = ee.Dictionary(elT);
    return [ee.Number(dT.get('group')).format("20%02d"), dT.get('sum')];
  });
var statsDictionaryT = ee.Dictionary(statsFormattedT.flatten());
print('Total loss: ', statsDictionaryT);

var statsFormattedH = ee.List(lossByYearH.get('groups'))
  .map(function(elH) {
    var dH = ee.Dictionary(elH);
    return [ee.Number(dH.get('group')).format("20%02d"), dH.get('sum')];
  });
var statsDictionaryH = ee.Dictionary(statsFormattedH.flatten());
print('High certainty loss: ', statsDictionaryH);

var statsFormattedM = ee.List(lossByYearM.get('groups'))
  .map(function(elM) {
    var dM = ee.Dictionary(elM);
    return [ee.Number(dM.get('group')).format("20%02d"), dM.get('sum')];
  });
var statsDictionaryM = ee.Dictionary(statsFormattedM.flatten());
print('Medium certainty loss: ', statsDictionaryM);

var statsFormattedL = ee.List(lossByYearL.get('groups'))
  .map(function(elL) {
    var dL = ee.Dictionary(elL);
    return [ee.Number(dL.get('group')).format("20%02d"), dL.get('sum')];
  });
var statsDictionaryL = ee.Dictionary(statsFormattedL.flatten());
print('Low certainty loss: ', statsDictionaryL);

var statsFormattedN = ee.List(lossByYearN.get('groups'))
  .map(function(elN) {
    var dN = ee.Dictionary(elN);
    return [ee.Number(dN.get('group')).format("20%02d"), dN.get('sum')];
  });
var statsDictionaryN = ee.Dictionary(statsFormattedN.flatten());
print('Non-fire loss: ', statsDictionaryN);

// Now draw charts for each category

var chartT = ui.Chart.array.values({
  array: statsDictionaryT.values(),
  axis: 0,
  xLabels: statsDictionaryT.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Total GFC Forest Cover Loss in Finland 2000-2021',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartT);

var chartH = ui.Chart.array.values({
  array: statsDictionaryH.values(),
  axis: 0,
  xLabels: statsDictionaryH.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'High Certainty Fire Forest Cover Loss in Finland 2000-2021',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartH);

var chartM = ui.Chart.array.values({
  array: statsDictionaryM.values(),
  axis: 0,
  xLabels: statsDictionaryM.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Medium Certainty Fire Forest Cover Loss in Finland 2000-2021',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartM);

var chartL = ui.Chart.array.values({
  array: statsDictionaryL.values(),
  axis: 0,
  xLabels: statsDictionaryL.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Low Certainty Fire Forest Cover Loss in Finland 2000-2021',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartL);

var chartN = ui.Chart.array.values({
  array: statsDictionaryN.values(),
  axis: 0,
  xLabels: statsDictionaryN.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Non-Fire Forest Cover Loss in Finland 2000-2021',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartN);

// Now limiting to 2000-2012 gains, extract high, medium, and low categories
var gfcFire21hOnGain12 = gfcFire21h.updateMask(gain2012);
var gfcFire21mOnGain12 = gfcFire21m.updateMask(gain2012);
var gfcFire21lOnGain12 = gfcFire21l.updateMask(gain2012);

// Set Up Pixel Area Calculations

var pixelArea = ee.Image.pixelArea();

// Calculate area represented by pixels for each category, and total
var fireLoss21hOnGain12 = gfcFire21hOnGain12.multiply(ee.Image.pixelArea());
var fireLoss21mOnGain12 = gfcFire21mOnGain12.multiply(ee.Image.pixelArea());
var fireLoss21lOnGain12 = gfcFire21lOnGain12.multiply(ee.Image.pixelArea());

// Now calculate losses by year: for total, high, medium, low, and non-fire

var lossByYearHOnGain12 = fireLoss21hOnGain12.addBands(lossYearPost12).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearMOnGain12 = fireLoss21mOnGain12.addBands(lossYearPost12).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

var lossByYearLOnGain12 = fireLoss21lOnGain12.addBands(lossYearPost12).reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1
    }),
  geometry: finland,
  scale: 30,
  maxPixels: 1e10
});

// Now format the stats by year for easy reading, again for each category

var statsFormattedHOnGain12 = ee.List(lossByYearHOnGain12.get('groups'))
  .map(function(elHOnGain12) {
    var dHOnGain12 = ee.Dictionary(elHOnGain12);
    return [ee.Number(dHOnGain12.get('group')).format("20%02d"), dHOnGain12.get('sum')];
  });
var statsDictionaryHOnGain12 = ee.Dictionary(statsFormattedHOnGain12.flatten());
print('High certainty fire loss on gain 2000-2012: ', statsDictionaryHOnGain12);

var statsFormattedMOnGain12 = ee.List(lossByYearMOnGain12.get('groups'))
  .map(function(elMOnGain12) {
    var dMOnGain12 = ee.Dictionary(elMOnGain12);
    return [ee.Number(dMOnGain12.get('group')).format("20%02d"), dMOnGain12.get('sum')];
  });
var statsDictionaryMOnGain12 = ee.Dictionary(statsFormattedMOnGain12.flatten());
print('Medium certainty fire loss on gain 2000-2012: ', statsDictionaryMOnGain12);

var statsFormattedLOnGain12 = ee.List(lossByYearLOnGain12.get('groups'))
  .map(function(elLOnGain12) {
    var dLOnGain12 = ee.Dictionary(elLOnGain12);
    return [ee.Number(dLOnGain12.get('group')).format("20%02d"), dLOnGain12.get('sum')];
  });
var statsDictionaryLOnGain12 = ee.Dictionary(statsFormattedLOnGain12.flatten());
print('Low certainty fire loss on gain 2000-2012: ', statsDictionaryLOnGain12);

// Now draw charts for each category

var chartHOnGain12 = ui.Chart.array.values({
  array: statsDictionaryHOnGain12.values(),
  axis: 0,
  xLabels: statsDictionaryHOnGain12.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'High Certainty Fire Forest Cover Loss in Finland 2013-2021 on Forest Cover Gained 2000-2012',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartHOnGain12);

var chartMOnGain12 = ui.Chart.array.values({
  array: statsDictionaryMOnGain12.values(),
  axis: 0,
  xLabels: statsDictionaryMOnGain12.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Medium Certainty Fire Forest Cover Loss in Finland 2013-2021 on Forest Cover Gained 2000-2012',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartMOnGain12);

var chartLOnGain12 = ui.Chart.array.values({
  array: statsDictionaryLOnGain12.values(),
  axis: 0,
  xLabels: statsDictionaryLOnGain12.keys()
}).setChartType('ColumnChart')
  .setOptions({
    title: 'Low Certainty Fire Forest Cover Loss in Finland 2013-2021 on Forest Cover Gained 2000-2012',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (square meters)'},
    legend: { position: "none" },
    lineWidth: 1,
    pointSize: 3
  });
print(chartLOnGain12);
