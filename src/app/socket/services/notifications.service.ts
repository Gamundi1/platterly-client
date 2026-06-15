import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../shared/services/http-handler.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly swPush = inject(SwPush);
  private readonly httpHandlerService = inject(HttpHandlerService);
  constructor() {
    this.listenForNotificationClicks();
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey:
            'BEcKbxgS_ZOCSyIQcJV7I4fXxHWDLn8WWqqeduLqg_FskNbXAomlcDocbZE_g_LtSAMw6NR3RDHtZQr3vDqVp6Q',
        })
        .then((sub) =>
          this.httpHandlerService
            .postRequest(UrlProvider.subscribeToNotifications, undefined, { subscription: sub })
            .subscribe(),
        )
        .catch((err) => console.error('Subscription failed: ', err));
    }
  }

  unsubscribeFromNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.unsubscribe().then(() => {});
    }
  }

  private listenForNotificationClicks() {
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      const data = notification?.data;

      if (data?.url) {
        window.location.href = data.url;
      }
    });
  }
}
