#!/bin/bash
echo "working.."
pid=`cat tmp/pids/unicorn.pid`
echo "killing $pid.."
kill $pid
echo "running.."
bundle exec unicorn_rails -c config/unicorn.rb -E production -D
