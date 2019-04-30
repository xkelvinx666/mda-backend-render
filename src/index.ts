const compile: string = process.argv[2];
import { ArtCompile } from './compile/art.compile';

switch (compile) {
  case 'art':
    new ArtCompile().compile();
    break;
}
