'use strict'
var audioApp = angular.module("audioApp", ['ngAudio', 'LocalStorageModule']);

audioApp.controller("AudioController", ['$log', '$scope', 'ngAudio', '$timeout', 'localStorageService', function($log, $scope, ngAudio, $timeout, localStorageService) {
  var control = this;
  $scope.sound = ngAudio.load("music/17.mp3");

  control.inicio = 0;
  control.fim = 0;
  control.texto = '';
  control.width_progress = {width: '0%'};
  control.id_process_stop = 0;

  control.pieces = localStorageService.get('pieces') || [];

  $scope.$watch('sound.progress', function(){
    control.width_progress = {width: (($scope.sound.progress)*100)+'%'};
  });

  $scope.$watch('control.pieces', function() {
      localStorageService.set('pieces', control.pieces);
  });

  control.play = function () {
    $scope.sound.play();
    $log.log();
  };

  control.pause = function () {
    $scope.sound.pause();
    $log.log($scope.sound.paused);
  };

  control.stop = function () {
    $scope.sound.stop();
  };

  control.stopAfterSeconds = function (seconds, id_process_stop) {
    $timeout(function() {
      if(id_process_stop != control.id_process_stop) return;

      --seconds;
      if(seconds == -1) {
        $scope.sound.stop();
      } else {
        control.stopAfterSeconds(seconds, id_process_stop);
      }
    }, 1000);
  };

  control.playInterval = function (begin, end) {
    $scope.sound.currentTime = parseInt(begin);
    $scope.sound.play();
    control.stopAfterSeconds(parseInt(end) - parseInt(begin), ++control.id_process_stop);
  };

  control.clear = function () {
    swal({
            title: "You are sure?",
            text: "This process will clear all the pieces.",
            type: "warning",
            html: true,
            showCancelButton: true,
            confirmButtonColor: "#2ecc71",
            confirmButtonText: "Yep!",
            cancelButtonText: "Nooo!",
            loseOnConfirm: false
        }, function(isConfirm) {
            if(isConfirm) {
              control.pieces = [];
            }
        });
  };

  control.savePiece = function() {
    control.pieces.push({inicio: control.inicio, fim: control.fim, texto: control.texto});
    localStorageService.set('pieces', control.pieces);
    sweetAlert("Saved", "Look your music piece below", "success");
    control.texto = "";
    control.inicio = 0;
    control.fim = 0;
  };

  control.removePiece = function (index) {
    control.pieces.splice(index, 1);
    localStorageService.set('pieces', control.pieces);
    // TODO I have to stop the sound, if it played
  };

  control.saveToPc = function (filename) {
    var data = control.pieces;

    if (!filename) {
      filename = 'music_piece.json';
    }

    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 2);
    }

    var blob = new Blob([data], {type: 'text/json'});
    var e = document.createEvent('MouseEvents');
    var a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };
}]);

audioApp.directive("fileread", [function () {
  return {
    scope: {
      fileread: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          var json = JSON.parse(loadEvent.target.result);

          scope.$apply(function () {
            scope.fileread = json;
          });
        };
        reader.readAsText(changeEvent.target.files[0]);
      });
    }
  }
}]);