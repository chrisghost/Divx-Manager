package controllers


import play.api._
import play.api.mvc._
import play.api.libs.iteratee._
import playcli.CLI
import java.io.File
import scala.concurrent._
import ExecutionContext.Implicits.global


object Converters {
  val formats = List("ogg", "webm")
  val qualities = List("vga","wvga","hd720")

  val pipedFFin = "ffmpeg -threads 5 -i pipe:0 "
  val pipedFFout = " pipe:1"

  def getConv(format:String, quality:String) = {
    val convstr = pipedFFin+
      (format match {
        case "ogg" => "-vcodec libtheora -acodec libvorbis -ab 192k -f ogg"
        case "webm" => "-acodec libvorbis -ab 192k -f webm"
      }) +" -s "+quality +pipedFFout

    Logger.info(convstr)
    CLI.pipe(convstr)
  }

}

object Streamer extends Controller {
  def view(format: String, quality: String, file: String) = Action {
    import Converters._

    println("Streaming "+file+" in "+format+" ("+quality+")")
    val stream =  Enumerator.fromFile(controllers.Api.getFile(file))

    Ok.stream(stream &> getConv(format, quality)).withHeaders(CONTENT_TYPE -> ("video/"+format))

  }

}
