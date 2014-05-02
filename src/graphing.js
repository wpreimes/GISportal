// Options currently requires a title
gisportal.graphs.data = function(params, options)  {
   var request = $.param( params );    

   function success(data) {
      gisportal.graphs.create(data, options);
   }
      
   function error(request, errorType, exception) {
      var data = {
         type: 'wcs data',
         request: request,
         errorType: errorType,
         exception: exception,
         url: this.url
      };          
      gritterErrorHandler(data);
   }

   gisportal.genericAsync('GET', gisportal.wcsLocation + request, null, success, error, 'json', null);
}

gisportal.graphs.create = function(data, options)  {
   if (data.error !== "") {
      var d = { error: data.error };
      gisportal.gritter.showNotification('graphError', d);
      return;
   }

   var graph;
   switch (data.type)  {
      case 'timeseries':
         graph = gisportal.graphs.timeseries(data, options);
         break;
      case 'histogram':
         debugger;
         graph = gisportal.graphs.histogram(data, options);
         break;
      case 'hovmollerLat':
         break;
      case 'hovmollerLon':
         break;
   }

   if (graph)  {
      var uid = 'wcsgraph' + Date.now();
      var title = options.title || "Graph";
      gisportal.graphs.createDialog(uid, title).append(graph);
   } 
}

gisportal.graphs.createDialog = function(uid, title)  {
   $(document.body).append('<div id="' + uid + '-graph" title="' + title + '"></div>');
   var dialog = $('#' + uid + '-graph');

   dialog.extendedDialog({
      position: ['center', 'center'],
      width: 700,
      height: 450,
      resizable: true,
      autoOpen: true,
      close: function() {
         $('#' + uid + '-graph').remove();
      },
      showHelp: false,
      showMinimise: true,
      dblclick: 'collapse',
      resizeStop: function()  {
         $('svg', this).resize();
      }
   });

   return dialog;
}

