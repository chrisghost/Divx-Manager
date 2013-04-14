package models

import play.api.libs.iteratee._
import akka.actor._
import playcli.CLI

class Stream(f:String, q:String, file:String, seek: Int) extends Actor {
  val format = new java.text.SimpleDateFormat("HH:mm:ss.SS")
  format.setTimeZone(java.util.TimeZone.getTimeZone("GMT+0"))
  val seek_f = " -ss "+format.format(new java.util.Date(seek*1000))+" "
  val pipedFFin = "ffmpeg"
  val multi_threads = " -threads 5 "
  val file_path = controllers.Api.baseDir+file
  val pipedFFout = " pipe:1"

  private val proc = getConv(f, q)

  def receive = {
    case "stream" => sender ! (proc)
  }


  def getConv(format:String, quality:String) = {
    val convstr = Seq(pipedFFin, seek_f, multi_threads, " -i ", file_path.replace(" ", "\\ ")," -ss 0 ",
      (format match {
        case "ogg" => "-vcodec theora -qscale 10 -acodec libvorbis -ab 192k -f ogg"
        case "webm" => "-vcodec libvpx -crf 10 -b:v 1M -acodec libvorbis -ab 192k -f webm"
      }),  " -s ", quality,pipedFFout);
    CLI.enumerate(convstr.mkString)
  }

}
