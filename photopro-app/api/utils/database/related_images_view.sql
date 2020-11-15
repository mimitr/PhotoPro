create or replace function
     images_with_common_tags(image_id_num int)
     returns table(
     img_id INT,
     tag character varying(32)
   )
 as $$
 begin
    RETURN QUERY select at1.image_id,at1.term from auto_tags as at1
    Inner Join auto_tags as at2 ON ( at1.term = at2.term)
    where at2.image_id=image_id_num
    AND NOT at1.image_id=at2.image_id;

end;

$$ language plpgsql;
