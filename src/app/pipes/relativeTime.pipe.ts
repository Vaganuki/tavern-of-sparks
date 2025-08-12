import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: false,
})

export class RelativeTimePipe implements PipeTransform {

  transform(value: string | Date, locale: string = 'en-EN'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'});

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, `second${diffInSeconds > 1 ? 's' : ''}`);
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), `minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`);
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), `hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`);
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), `day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`);
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), `month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''}`);
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), `year${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''}`);
    }
  }
}
