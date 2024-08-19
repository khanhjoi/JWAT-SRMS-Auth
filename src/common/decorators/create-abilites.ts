// import { ForbiddenError, subject } from '@casl/ability';
// import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
// import db from '../db';
// import { Article } from '../models/Article';

// const articles = () => db<Article>('articles');

// export async function create(ability: AppAbility, partialArticle: Omit<Article, 'id'>) {
//   ForbiddenError.from(ability).throwUnlessCan('create', subject('Article', partialArticle));
//   const [id] = await articles().insert(partialArticle);

//   return { id, ...partialArticle } as Article;
// }