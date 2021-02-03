/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
var FEATURE_PROPERTIES_CORE = [
  {
    name: "id",
    key: "ID",
    hint: "The unique identifier for the feature",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "alias",
    key: "Alias",
    hint: "A human readable name for the feature",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "feature_class_name",
    key: "Feature class name",
    hint: "The internal name for the feature in the PostGIS database",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "description",
    key: "Description",
    hint: "Full description of the feature",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "creation_date",
    key: "Creation date",
    hint: "The date the feature was created or imported",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "tilesetid",
    key: "Mapbox ID",
    hint: "The unique identifier of the feature tileset in Mapbox",
    showForOld: false,
    showForNew: false,
  },
  {
    name: "target_value",
    key: "Target percent",
    hint: "The target percentage for the feature within the planning grid",
    showForOld: true,
    showForNew: true,
  },
  {
    name: "spf",
    key: "Species Penalty Factor",
    hint:
      "The species penalty factor is used to weight the likelihood of getting a species in the results",
    showForOld: true,
    showForNew: true,
  },
  {
    name: "preprocessed",
    key: "Preprocessed",
    hint:
      "Whether or not the feature has been intersected with the planning units",
    showForOld: false,
    showForNew: true,
  },
  {
    name: "pu_count",
    key: "Planning unit count",
    hint:
      "The number of planning units that intersect the feature (calculated during pre-processing)",
    showForOld: true,
    showForNew: true,
  },
];
//application level global constants
module.exports = Object.freeze({
  MARXAN_REGISTRY: "https://marxanweb.github.io/general/registry/marxan.json", //url to the marxan registry
  DOCS_ROOT: "https://docs.marxanweb.org/",
  ERRORS_PAGE: "https://docs.marxanweb.org/errors.html",
  SEND_CREDENTIALS: true, //if true all post requests will send credentials
  TORNADO_PATH: "/marxan-server/",
  TIMEOUT: 0, //disable timeout setting
  MAPBOX_USER: "blishten",
  MAPBOX_STYLE_PREFIX: "mapbox://styles/",
  PLANNING_UNIT_STATUSES: [1, 2, 3],
  IUCN_CATEGORIES: [
    "None",
    "IUCN I-II",
    "IUCN I-IV",
    "IUCN I-V",
    "IUCN I-VI",
    "All",
  ],
  //constants for creating new planning grids
  DOMAINS: ["Marine", "Terrestrial"],
  SHAPES: ["Hexagon", "Square"],
  AREAKM2S: [10, 20, 30, 40, 50, 100],
  //layer source names
  PLANNING_UNIT_SOURCE_NAME: "marxan_planning_units_source",
  WDPA_SOURCE_NAME: "marxan_wdpa_source",
  //layer names
  PU_LAYER_NAME: "marxan_pu_layer", //layer showing the planning units
  STATUS_LAYER_NAME: "marxan_pu_status_layer", //layer showing the status of planning units
  COSTS_LAYER_NAME: "marxan_pu_costs_layer", //layer showing the cost of planning units
  RESULTS_LAYER_NAME: "marxan_pu_results_layer", //layer for either the sum of solutions or the individual solutions
  WDPA_LAYER_NAME: "marxan_wdpa_polygon_layer", //layer showing the protected areas from the WDPA
  LAYER_TYPE_SUMMED_SOLUTIONS: "summed_solutions",
  LAYER_TYPE_PLANNING_UNITS: "pus",
  LAYER_TYPE_PLANNING_UNITS_COST: "cost",
  LAYER_TYPE_PLANNING_UNITS_STATUS: "status",
  LAYER_TYPE_PROTECTED_AREAS: "pas",
  LAYER_TYPE_FEATURE_LAYER: "feature",
  LAYER_TYPE_FEATURE_PLANNING_UNIT_LAYER: "feature_puid",
  //planning unit statuses
  PU_STATUS_DEFAULT: {
    fillColor: "none",
    strokeColor: "lightgray",
    label: "Default",
  },
  PU_STATUS_LOCKED_IN: {
    fillColor: "none",
    strokeColor: "blue",
    label: "Locked in",
  },
  PU_STATUS_LOCKED_OUT: {
    fillColor: "none",
    strokeColor: "red",
    label: "Locked out",
  },
  //layer default styles
  PU_LAYER_OPACITY: 0.6,
  PU_COSTS_LAYER_OPACITY: 0.1,
  STATUS_LAYER_LINE_WIDTH: 1.5,
  WDPA_FILL_LAYER_OPACITY: 0.2,
  FEATURE_LAYER_OPACITY: 0.9,
  FEATURE_PLANNING_GRID_LAYER_OPACITY: 0.9,
  RESULTS_LAYER_OPACITY: 0.8,
  COST_COLORS: [
    "rgba(255,255,204,0.8)",
    "rgba(255,237,160,0.8)",
    "rgba(254,217,118,0.8)",
    "rgba(254,178,76,0.8)",
    "rgba(253,141,60,0.8)",
    "rgba(252,78,42,0.8)",
    "rgba(227,26,28,0.8)",
    "rgba(189,0,38,0.8)",
    "rgba(128,0,38,0.8)",
  ],
  UNIFORM_COST_NAME: "Equal area",
  //an array of feature property information that is used in the Feature Information dialog box - showForOld sets whether that property is shown for old versions of marxan
  FEATURE_PROPERTIES_POLYGONS: FEATURE_PROPERTIES_CORE.concat([
    {
      name: "area",
      key: "Total area",
      hint: "The total area for the feature in Km2 (i.e. globally)",
      showForOld: false,
      showForNew: false,
    },
    {
      name: "pu_area",
      key: "Planning grid area",
      hint:
        "The area of the feature within the planning grid in Km2 (calculated during pre-processing)",
      showForOld: true,
      showForNew: true,
    },
    {
      name: "target_area",
      key: "Target area",
      hint:
        "The total area that needs to be protected to achieve the target percentage in Km2 (calculated during a Marxan Run)",
      showForOld: true,
      showForNew: true,
    },
    {
      name: "protected_area",
      key: "Area protected",
      hint:
        "The total area protected in the current solution in Km2 (calculated during a Marxan Run)",
      showForOld: true,
      showForNew: true,
    },
  ]),
  FEATURE_PROPERTIES_POINTS: FEATURE_PROPERTIES_CORE.concat([
    {
      name: "area",
      key: "Total",
      hint: "The total amount for the feature (i.e. globally)",
      showForOld: false,
      showForNew: false,
    },
    {
      name: "pu_area",
      key: "Planning grid amount",
      hint:
        "The total amount of the feature within the planning grid (calculated during pre-processing)",
      showForOld: true,
      showForNew: true,
    },
    {
      name: "target_area",
      key: "Target amount",
      hint:
        "The amount that needs to be protected to achieve the target percentage (calculated during a Marxan Run)",
      showForOld: true,
      showForNew: true,
    },
    {
      name: "protected_area",
      key: "Protected amount",
      hint:
        "The amount protected in the current solution (calculated during a Marxan Run)",
      showForOld: true,
      showForNew: true,
    },
  ]),
});
