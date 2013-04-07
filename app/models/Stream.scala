package models

import play.api.libs.iteratee._
import akka.actor._
import playcli.CLI

class Stream(f:String, q:String, file:String) extends Actor {
  val pipedFFin = "ffmpeg -threads 5 -i pipe:0 "
  val pipedFFout = " pipe:1"

  private val proc = getConv(f, q)

  def receive = {
    case "stream" => sender ! (Enumerator.fromFile(controllers.Api.getFile(file)) &> proc)
  }


  def getConv(format:String, quality:String) = {
    val convstr = pipedFFin+
      (format match {
        case "ogg" => "-vcodec libtheora -acodec libvorbis -ab 192k -f ogg"
        case "webm" => "-acodec libvorbis -ab 192k -f webm"
      }) +" -s "+quality +pipedFFout

    CLI.pipe(convstr)
  }

}
