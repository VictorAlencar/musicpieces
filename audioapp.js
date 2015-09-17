var audioApp = angular.module("audioApp", ['ngAudio', 'LocalStorageModule']);

audioApp.controller("AudioController", ['$log', '$scope', 'ngAudio', '$timeout', 'localStorageService', function($log, $scope, ngAudio, $timeout, localStorageService) {
  var control = this;
  $scope.sound = ngAudio.load("music/16.mp3");

  control.inicio = 0;
  control.fim = 0;
  control.texto = '';
  control.width_progress = {width: '0%'};

  control.pieces = localStorageService.get('pieces') || [];

  $scope.$watch('sound.progress', function(){
    control.width_progress = {width: (($scope.sound.progress)*100)+'%'};
  });

  control.play = function () {
    $scope.sound.play();
  };

  control.pause = function () {
    $scope.sound.pause();
  };

  control.stop = function () {
    $scope.sound.stop();
  };

  control.stopAfterSeconds = function (seconds) {
    $timeout(function() {
      --seconds;
      if(seconds == -1) {
        $scope.sound.stop();
      } else {
        control.stopAfterSeconds(seconds);
      }
    }, 1000);
  };

  control.playInterval = function (inicio, fim) {
    $scope.sound.currentTime = parseInt(inicio);
    $scope.sound.play();
    control.stopAfterSeconds(parseInt(fim) - parseInt(inicio));
  };

  control.savePiece = function() {
    control.pieces.push({inicio: control.inicio, fim: control.fim, texto: control.texto});
    localStorageService.set('pieces', control.pieces);
    sweetAlert("Saved", "Look your music piece below", "success");
    control.texto = "";
    control.inicio = 0;
    control.fim = 0;
  };

  control.saveToPc = function (filename) {
    var data = control.pieces;

    if (!filename) {
      filename = 'download.json';
    }

    if (typeof data === 'object') {
      data = JSON.stringify(data, undefined, 2);
    }

    var blob = new Blob([data], {type: 'text/json'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  };
}]);