package controllers


import play.api._
import play.api.mvc._
import play.api.libs.iteratee._
import playcli.CLI
import java.io.File
import scala.concurrent._
import ExecutionContext.Implicits.global
import models.Streamers
import scala.sys.process._

object Streamer extends Controller {
  def view(format: String, quality: String, file: String, seek: Int) = Action {
    Ok.stream(Streamers.createStream(format, quality, file, seek)).withHeaders(CONTENT_TYPE -> ("video/"+format))
  }
  def info(file: String) = Action {
    val rawInfo = (Seq("./scripts/getVideoDuration.sh",Api.baseDir+file)).!!
    val parts = rawInfo.split(":")
    val duration = parts(0).toInt*3600+parts(1).toInt*60+(parts(2).split("\\."))(0).toInt
    Ok(duration.toString)
  }
}
