# -*- coding: utf-8 -*-

def normalize( params )
  params.each do |key, _value|
    params[ key ] = params[ key ].is_a?( Date ) ? params[ key ].iso8601 : params[ key ].to_s
  end
end
