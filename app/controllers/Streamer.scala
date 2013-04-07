package controllers


import play.api._
import play.api.mvc._
import play.api.libs.iteratee._
import playcli.CLI
import java.io.File
import scala.concurrent._
import ExecutionContext.Implicits.global
import models.Streamers


object Streamer extends Controller {
  def view(format: String, quality: String, file: String) = Action {
    Ok.stream(Streamers.createStream(format, quality, file)).withHeaders(CONTENT_TYPE -> ("video/"+format))
  }

}
