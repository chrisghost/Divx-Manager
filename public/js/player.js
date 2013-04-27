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
      seeked: 0,
      video_id: "video"
    };
    this.createTimeline();
    this.seek(0);
  },
  createTimeline: function() {
    var id = "player-timeline-"+Date.now();

    var timelinedata =
      {
        "id": id,
        "qualities": [{ "id": "qqvga", "name": "120p"},
                      { "id": "qvga", "name": "240p"},
                      { "id": "vga", "name": "480p"},
                      { "id": "hd720", "name": "720p"}]
      };

    $(s.elem).html(Mustache.render($("#tpl_controls").html(),timelinedata));

    $("#"+id).on('click', {that: this}, function(e){
      e.data.that.seek(Math.floor(((e.pageX-$(s.elem).offset().left)/$(s.elem).width())*s.length))
    });
    $(".play-action").on('click', {that: this, setts : s}, function(e){ e.data.that.togglePlay()});
    $(".sw-quality").on('click', {that: this, setts : s}, function(e){
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
    gbi(s.video).innerHTML = contHtml;
    gbi(s.video_id).addEventListener("timeupdate", this.updateTimeline);
    gbi(s.video_id).addEventListener("timeupdate", this.updateBuffered);
    gbi(s.video_id).addEventListener("loadeddata", this.updateContainer);
    gbi(s.video_id).addEventListener("pause", function(){
        $(".play-button a i").addClass("icon-play");
        $(".play-button a i").removeClass("icon-pause");
    });
    gbi(s.video_id).addEventListener("play", function(){
        $(".play-button a i").removeClass("icon-play");
        $(".play-button a i").addClass("icon-pause");
    });
  },

  updateTimeline: function() {
    var p = Math.floor(((document.getElementById("video").currentTime+s.seeked)/s.length)*100);
    $($(s.elem).find(".player-timeline .player-timeline-read")[0]).css({"width":p+"%"});
  },

  updateContainer: function() {
    $(s.elem).parent().parent().css({  "width": $("#"+s.video_id).width(),
                                        "height": $("#"+s.video_id).height(),
                              "margin-left": -$("#"+s.video_id).width()/2});
    $(".qualities").css({"margin-left":$("#"+s.video_id).width()-60});
    $(".player-timeline-container").css({"width":$("#"+s.video_id).width()-$(".play-button").outerWidth()-$(".quality-switcher").outerWidth()});
  }
}

function gbi(id) { return document.getElementById(id); }
