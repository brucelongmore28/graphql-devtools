import { RemplWrapper } from "../rempl-wrapper";
import { ClientObject } from "../../types";

export class ApolloClientsPublisher {
  private static _instance: ApolloClientsPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private activeClients: Set<string> = new Set();

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloClientsPublisher._instance) {
      return ApolloClientsPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      "apollo-clients",
      this.globalOperationsFetcherHandler.bind(this),
      6000
    );
    this.apolloPublisher = apolloPublisher;

    ApolloClientsPublisher._instance = this;
  }

  private updateActiveClients(clientObjects: ClientObject[]) {
    this.activeClients = new Set(
      clientObjects.map((clientObjects) => clientObjects.clientId)
    );
  }

  private hasApolloClientsChanged(clientObjects: ClientObject[]) {
    let hasChanged;
    if (clientObjects.length !== this.activeClients.size) {
      hasChanged = true;
    }

    hasChanged = clientObjects.some(
      (client: ClientObject) => !this.activeClients.has(client.clientId)
    );

    if (hasChanged) {
      this.updateActiveClients(clientObjects);
    }

    return hasChanged;
  }

  private globalOperationsFetcherHandler(clientObjects: ClientObject[]) {
    if (!this.hasApolloClientsChanged(clientObjects)) {
      return;
    }

    const apolloClientIds = clientObjects.map(
      (apolloClient) => apolloClient.clientId
    );

    this.apolloPublisher.ns("apollo-client-ids").publish(apolloClientIds);
  }
}