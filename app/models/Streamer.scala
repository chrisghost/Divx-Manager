package models

import akka.actor._
import scala.util.Random
import akka.pattern.ask
import scala.concurrent.{Future, Await}
import play.api.libs.iteratee._
import akka.util.Timeout
import scala.util.{Success, Failure}
import scala.concurrent.ExecutionContext.Implicits.global


object Streamers {
  val system = ActorSystem("Streamer")
  implicit val timeout = Timeout(10000)

  def createStream(f:String, q:String, file:String, seek:Int) : Enumerator[Array[Byte]] = {
    val sname = Random.alphanumeric.take(8).mkString
    val newStream = system.actorOf(Props(new Stream(f, q, file, seek)), name = sname)

    val res = ask(system.actorFor("/user/"+sname), "stream")
    Await.result(res, timeout.duration).asInstanceOf[Enumerator[Array[Byte]]]
  }
}
