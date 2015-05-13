worker_processes 2
working_directory "/home/zelder/rurails/zerura1/"

preload_app true

timeout 30

listen "/home/zelder/rurails/zerura1/tmp/sockets/unicorn.sock", :backlog => 64

pid "/home/zelder/rurails/zerura1/tmp/pids/unicorn.pid"

stderr_path "/home/zelder/rurails/zerura1/log/unicorn.stderr.log"
stdout_path "/home/zelder/rurails/zerura1/log/unicorn.stdout.log"

before_fork do |server, worker|
    defined?(ActiveRecord::Base) and
        ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
    defined?(ActiveRecord::Base) and
        ActiveRecord::Base.establish_connection
end
