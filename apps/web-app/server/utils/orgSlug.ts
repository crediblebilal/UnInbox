import { H3Event, getHeader } from 'h3';
import { db } from '@uninbox/database';
import { eq } from '@uninbox/database/orm';
import { orgs } from '@uninbox/database/schema';

interface OrgContext {
  id: number;
  members: number[];
}

export const validateOrgSlug = async (
  event: H3Event
): Promise<OrgContext | null> => {
  const orgSlug = getHeader(event, 'org-slug');
  if (!orgSlug) {
    return null;
  }

  const cachedSlugOrgContext: OrgContext | null =
    await useStorage('org-context').getItem(orgSlug);
  if (cachedSlugOrgContext) {
    return cachedSlugOrgContext;
  }

  const orgLookupResult = await db.read.query.orgs.findFirst({
    where: eq(orgs.slug, orgSlug),
    columns: { id: true },
    with: {
      members: {
        columns: { id: true }
      }
    }
  });
  if (!orgLookupResult) {
    return null;
  }

  const orgContext = {
    id: +orgLookupResult.id,
    members: orgLookupResult.members.map((member) => +member.id)
  };
  console.log('orgContext', orgContext);

  await useStorage('org-context').setItem(orgSlug, orgContext);
  return orgContext;
};