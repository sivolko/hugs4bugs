hey folks ! 

This is open source blog , I have written for my own reference and lemme know if you find this useful and insightful.


Feel free to raise PR 
# hugs4bugs

Currently writing about Cloud Security and Cyber Security


## Run Locally 
 Clone this repo and run following commands 
 ```
 1. gem install bundler && bundle install && bundle exec jekyll serve

 ```

 To load server live just add -l 

## Run inside Container (Docker)

Edit docker-compose file as per your preferences and run following commands 

1. docker-compose up (starts server)
2. docker-compose stop (stops server)
3. docker-compose down (unmounts and delete the container including Networks)