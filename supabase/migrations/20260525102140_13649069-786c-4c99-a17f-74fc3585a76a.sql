insert into storage.buckets (id, name, public) values ('email-assets','email-assets', true) on conflict (id) do update set public = true;
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'email-assets public read' and tablename = 'objects' and schemaname = 'storage') then
    create policy "email-assets public read" on storage.objects for select using (bucket_id = 'email-assets');
  end if;
end $$;