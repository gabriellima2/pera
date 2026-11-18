-- Situações pré-definidas para registros de momento (lookup read-only no app).

insert into public.situations (id, label, code, "order", active)
values
  ('e55a4213-28d6-4635-bd76-21879a1d3d8e', 'Conversa casual', 'casual_conversation', 0, true),
  ('fb1b148e-146a-46b7-b5fb-7cb9141b24a4', 'Reunião de trabalho', 'work_meeting', 1, true),
  ('fe81f6e8-0f0e-409c-803e-7736dc7f0e82', 'Aula', 'class', 2, true),
  ('ef56812c-eda0-499a-a0c2-398fd2e23548', 'Ligação telefônica', 'phone_call', 3, true),
  ('fac54b7d-7dfc-417a-9804-07a2e6fe37c9', 'Chamada de vídeo', 'video_call', 4, true),
  ('6b2bd730-e307-4735-83e1-0bce074341b0', 'Apresentação', 'presentation', 5, true),
  ('64b8c3e7-3b69-44b5-88a9-7f6c8e1757e2', 'Entrevista', 'interview', 6, true),
  ('c97869d2-cbc9-452a-90f4-fea84cf9a473', 'Conhecer pessoas novas', 'new_people', 7, true),
  ('1af2c377-df02-4c08-b82d-7010d00555be', 'Lugar público', 'public_place', 8, true)
on conflict (id) do update set
  label = excluded.label,
  code = excluded.code,
  "order" = excluded."order",
  active = excluded.active;