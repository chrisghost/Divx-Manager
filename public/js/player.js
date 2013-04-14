var s,
Player = {
  init: function(_video, _elem, _length, _path, _formats, _quality) {
    s = {
      video: _video,
      elem: _elem,
      length: _length,
      path : _path,
      formats: _formats,
      quality: _quality,
      seeked: 0
    };
    this.createTimeline();
    this.seek(0);
  },
  createTimeline: function() {
    var id = "player-timeline-"+Date.now();
    $(s.elem).html('<div class="play-button"><a href="#" class="play-action"><i class="icon-play icon-white"></i></a></div>'+
      '<div class="player-timeline-container">'+
      '<div id="'+id+'" class="player-timeline">'+
      '<div class="player-timeline-read"></div>'+
      '</div>'+
      '</div>'+
      "        <div class='dropdown-toggle quality-switcher' data-toggle='dropdown'><a href='#'><i class='icon-cog icon-white'></i>"+
      "        </a></div>"+
      "        <div class='dropdown-menu qualities'><ul>"+
      "            <li><a class='sw-quality' data-quality='vga'>vga</a></li>"+
      "            <li><a class='sw-quality' data-quality='hd720'>hd720</a></li>"+
      "        </ul></div>");
    $("#"+id).on('click', {that: this}, function(e){
      e.data.that.seek(Math.floor(((e.pageX-$(s.elem).offset().left)/$(s.elem).width())*s.length))
    });
    $(".play-action").on('click', {that: this, setts : s}, function(e){ a.data.that.togglePlay()});
    $(".sw-quality").on('click', {that: this, setts : s}, function(e){
      console.log(e);
      e.data.setts.quality=$(e.currentTarget).data("quality");
      e.data.that.seek(e.data.setts.seeked)});
  },

  togglePlay:function() {
      if(document.getElementById("video").paused) {
        document.getElementById("video").play();
      } else {
        document.getElementById("video").pause();
      }
  },
  stopPlaybackAndDownload:function() {
    if( document.getElementById("video") != null) {
      document.getElementById("video").pause();;
      document.getElementById("video").src= "";
    }

  },

  seek:function(pos) {
    this.stopPlaybackAndDownload();
    s.seeked = pos;
    document.getElementById(s.video).innerHTML = '';
    var contHtml = '<video id="video" autoplay >';
    for(i in s.formats) {
        contHtml += '<source src="/api/preview/'+s.formats[i]+'/'+s.quality+'/'+pos+'/'+s.path+'" type="video/'+s.formats[i]+'" />';
    }
        '</video>';
    document.getElementById(s.video).innerHTML = contHtml;
    $("#video").on("timeupdate", this.updateTimeline);
    $("#video").on("loadeddata", this.updateContainer);
    $("#video").on("pause", function(){
        $(".play-button a i").addClass("icon-play");
        $(".play-button a i").removeClass("icon-pause");
    });
    $("#video").on("play", function(){
        $(".play-button a i").removeClass("icon-play");
        $(".play-button a i").addClass("icon-pause");
    });
  },

  updateTimeline: function() {
    var p = Math.floor(((document.getElementById("video").currentTime+s.seeked)/s.length)*100);
    $($(s.elem).find(".player-timeline .player-timeline-read")[0]).css({"width":p+"%"});
  },

  updateContainer: function() {
    $(s.elem).parent().parent().css({  "width": $("#video").width(),
                                        "height": $("#video").height(),
                              "margin-left": -$("#video").width()/2});
    $(".qualities").css({"margin-left":$("#video").width()-60});
    $(".player-timeline-container").css({"width":$("#video").width()-$(".play-button").outerWidth()-$(".quality-switcher").outerWidth()});
  }
}
