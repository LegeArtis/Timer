import {Component, OnInit} from '@angular/core';
import {take, takeUntil} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  time = 0;
  timer = '00: 00: 00';
  settingTime;

  ngOnInit() {
    const startClick = fromEvent(document.getElementById('start'), 'click');
  //  const setTimeClick = fromEvent(document.getElementById('setTime'), 'click');
    startClick.subscribe(() => {
      const waitClick = fromEvent(document.getElementById('wait'), 'click');
      const resetClick = fromEvent(document.getElementById('reset'), 'click');

      resetClick.subscribe(() => {
        this.time = 0;
        this.timer = this.secondsToTimerTime();
      });

      interval(1000).pipe(takeUntil(waitClick)).pipe(takeUntil(resetClick)).subscribe(() => {
          --this.time;
          this.timer = this.secondsToTimerTime();
      });
    });
  }

  public secondsToTimerTime() {
   const seconds = this.time % 60;
   const minutes = Math.floor(this.time / ( 60 )) % 60;
   const hours = (Math.floor( this.time / ( 60 * 60 )) % 24);

   return `${hours < 10 ? '0' + hours : hours}: ${minutes < 10 ? '0' + minutes : minutes}: ${seconds < 10 ? '0' + seconds : seconds}`;
  }

  public registerForm(value) {
   // console.log(value.value.hours + ' ' + value.value.minutes);
  }

  public setTime(hours, minutes, seconds) {
    console.log(seconds + ' ' + minutes + ' ' + hours );
    this.time = +seconds + +minutes * 60 + +hours * 60 * 60;
    if (this.time <= 0) {
      alert(`Кто-то ввел непрвильную циферку ! Время не может быть отрицателным или нулем!`);
    } else {
      this.settingTime = this.time;
      this.timer = this.secondsToTimerTime();
    }
  }
}
