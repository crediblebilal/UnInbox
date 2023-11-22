import { validateOrgSlug } from './../utils/orgSlug';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const orgSlugValidation = await validateOrgSlug(event);
  if (!orgSlugValidation.orgId) {
    event.context.orgId = null;
  }
  event.context.orgId = orgSlugValidation.orgId;
});
