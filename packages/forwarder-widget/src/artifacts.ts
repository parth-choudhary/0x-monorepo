import { artifacts as ZeroExArtifacts } from '0x.js/lib/src/artifacts';

import Forwarder from './artifacts/Forwarder.json';
import { Artifact } from './types';

export const artifacts = {
    ZRXArtifact: (ZeroExArtifacts.ZRXArtifact as any) as Artifact,
    TokenArtifact: (ZeroExArtifacts.TokenArtifact as any) as Artifact,
    ExchangeArtifact: (ZeroExArtifacts.ExchangeArtifact as any) as Artifact,
    EtherTokenArtifact: (ZeroExArtifacts.EtherTokenArtifact as any) as Artifact,
};
